import { FastifyRequest } from "fastify";
import { CrudController } from "../../../../core/platform/services/webserver/types";
import { NotificationListQueryParameters } from "../../types";
import {
  ResourceCreateResponse,
  ResourceDeleteResponse,
  ResourceGetResponse,
  ResourceListResponse,
} from "../../../../utils/types";
import { UserNotificationBadge } from "../../entities";
import { getWebsocketInformation } from "../../services/realtime";
import gr from "../../../global-resolver";

export class NotificationController
  implements
    CrudController<
      ResourceGetResponse<UserNotificationBadge>,
      ResourceCreateResponse<UserNotificationBadge>,
      ResourceListResponse<UserNotificationBadge>,
      ResourceDeleteResponse
    >
{
  async list(
    request: FastifyRequest<{
      Querystring: NotificationListQueryParameters;
    }>,
  ): Promise<ResourceListResponse<UserNotificationBadge>> {
    let resources: UserNotificationBadge[] = [];
    let page_token = "";

    //Get one badge per company if requested
    if (request.query.all_companies) {
      const list = await gr.services.notificationBadge.listForUserPerCompanies(
        request.currentUser.id,
      );
      resources = resources.concat(list.getEntities());
    }

    if (request.query.company_id) {
      const list = await gr.services.notificationBadge.listForUser(
        request.query.company_id,
        request.currentUser.id,
        { ...request.query },
      );
      resources = resources.concat(list.getEntities());
      page_token = list.page_token;
    }

    return {
      ...{
        resources,
      },
      ...(request.query.websockets && {
        websockets: gr.platformServices.realtime.sign(
          [getWebsocketInformation(request.currentUser)],
          request.currentUser.id,
        ),
      }),
      ...(page_token && {
        next_page_token: page_token,
      }),
    };
  }
}
