import { DatabaseServiceAPI } from "../../../../core/platform/services/database/api";
import ChannelServiceAPI, { MemberService } from "../../provider";
import { Service } from "./service";
import UserServiceAPI from "../../../user/api";
import { PlatformServicesAPI } from "../../../../core/platform/services/platform-services";

export function getService(
  platformService: PlatformServicesAPI,
  channelService: ChannelServiceAPI,
  userService: UserServiceAPI,
): MemberService {
  return new Service(platformService, channelService, userService);
}
