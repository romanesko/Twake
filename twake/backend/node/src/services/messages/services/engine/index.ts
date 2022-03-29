import { localEventBus } from "../../../../core/platform/framework/pubsub";
import { Initializable } from "../../../../core/platform/framework";
import { MessageLocalEvent } from "../../types";
import { ChannelViewProcessor } from "./processors/channel-view";
import { ChannelMarkedViewProcessor } from "./processors/channel-marked";
import { UserMarkedViewProcessor } from "./processors/user-marked";
import { UserInboxViewProcessor } from "./processors/user-inbox";
import { FilesViewProcessor } from "./processors/files";
import Repository from "../../../../core/platform/services/database/services/orm/repository/repository";
import { Thread } from "../../entities/threads";
import { ChannelSystemActivityMessageProcessor } from "./processors/system-activity-message";
import { MessageToNotificationsProcessor } from "./processors/message-to-notifications";
import { ResourceEventsPayload } from "../../../../utils/types";
import _ from "lodash";
import { StatisticsMessageProcessor } from "../../../statistics/pubsub/messages";
import gr from "../../../global-resolver";

export class MessagesEngine implements Initializable {
  private channelViewProcessor: ChannelViewProcessor;
  private channelMarkedViewProcessor: ChannelMarkedViewProcessor;
  private userMarkedViewProcessor: UserMarkedViewProcessor;
  private userInboxViewProcessor: UserInboxViewProcessor;
  private filesViewProcessor: FilesViewProcessor;
  private messageToNotifications: MessageToNotificationsProcessor;

  private threadRepository: Repository<Thread>;

  constructor() {
    this.channelViewProcessor = new ChannelViewProcessor();
    this.channelMarkedViewProcessor = new ChannelMarkedViewProcessor();
    this.userMarkedViewProcessor = new UserMarkedViewProcessor();
    this.userInboxViewProcessor = new UserInboxViewProcessor();
    this.filesViewProcessor = new FilesViewProcessor();
    this.messageToNotifications = new MessageToNotificationsProcessor();
  }

  async dispatchMessage(e: MessageLocalEvent) {
    const thread = await this.threadRepository.findOne({
      id: e.resource.thread_id,
    });

    await this.channelViewProcessor.process(thread, e);
    await this.channelMarkedViewProcessor.process(thread, e);
    await this.userInboxViewProcessor.process(thread, e);
    await this.userMarkedViewProcessor.process(thread, e);
    await this.filesViewProcessor.process(thread, e);
    await this.messageToNotifications.process(thread, e);

    if (e.created) {
      for (const workspaceId of _.uniq(
        thread.participants.filter(p => p.type == "channel").map(p => p.workspace_id),
      )) {
        localEventBus.publish<ResourceEventsPayload>("channel:message_sent", {
          message: {
            thread_id: e.resource.thread_id,
            sender: e.resource.user_id,
            workspace_id: workspaceId,
          },
          user: e.context.user,
        });
      }
    }
  }

  async init(): Promise<this> {
    this.threadRepository = await gr.database.getRepository<Thread>("threads", Thread);

    await this.channelViewProcessor.init();
    await this.channelMarkedViewProcessor.init();
    await this.userInboxViewProcessor.init();
    await this.userMarkedViewProcessor.init();
    await this.filesViewProcessor.init();
    gr.platformServices.pubsub.processor.addHandler(new ChannelSystemActivityMessageProcessor());
    gr.platformServices.pubsub.processor.addHandler(new StatisticsMessageProcessor());

    localEventBus.subscribe("message:saved", async (e: MessageLocalEvent) => {
      this.dispatchMessage(e);
    });

    return this;
  }
}
