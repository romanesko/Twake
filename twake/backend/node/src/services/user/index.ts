import { Consumes, Prefix, TwakeService } from "../../core/platform/framework";
import UserServiceAPI from "./api";
import web from "./web/index";
import { getService } from "./services";
import { PlatformServicesAPI } from "../../core/platform/services/platform-services";
import { ApplicationServiceAPI } from "../applications/api";

@Prefix("/internal/services/users/v1")
@Consumes(["platform-services", "applications"])
export default class UserService extends TwakeService<UserServiceAPI> {
  version = "1";
  name = "user";
  private service: UserServiceAPI;

  public async doInit(): Promise<this> {
    const platformServices = this.context.getProvider<PlatformServicesAPI>("platform-services");
    const applications = this.context.getProvider<ApplicationServiceAPI>("applications");
    this.service = getService(platformServices, applications);
    await this.service?.init(this.context);
    platformServices.fastify.getServer().register((instance, _opts, next) => {
      web(instance, { prefix: this.prefix, service: this.service });
      next();
    });
    return this;
  }

  api(): UserServiceAPI {
    return this.service;
  }
}
