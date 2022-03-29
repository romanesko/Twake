import { Prefix, TwakeService } from "../../core/platform/framework";
import { ConsoleServiceAPI } from "./api";
import gr from "../global-resolver";
import WebServerAPI from "../../core/platform/services/webserver/provider";
import web from "./web";

@Prefix("/internal/services/console/v1")
export default class ConsoleService extends TwakeService<undefined> {
  version = "1";
  name = "console";

  public async doInit(): Promise<this> {
    const fastify = this.context.getProvider<WebServerAPI>("webserver").getServer();
    fastify.register((instance, _opts, next) => {
      web(instance, { prefix: this.prefix });
      next();
    });
    return this;
  }

  // TODO: remove
  api(): undefined {
    return undefined;
  }
}
