import yargs from "yargs";
import twake from "../../../twake";
import ora from "ora";
import { TwakePlatform } from "../../../core/platform/platform";
import { DatabaseServiceAPI } from "../../../core/platform/services/database/api";
import PhpApplication, { TYPE as phpTYPE } from "./php-application/php-application-entity";
import { Pagination } from "../../../core/platform/framework/api/crud-service";
import Application, {
  TYPE,
  getInstance,
} from "../../../services/applications/entities/application";
import _ from "lodash";

type Options = {
  onlyApplication?: string;
  replaceExisting?: boolean;
};

class ApplicationMigrator {
  database: DatabaseServiceAPI;

  constructor(readonly platform: TwakePlatform) {
    this.database = this.platform.getProvider<DatabaseServiceAPI>("database");
  }

  public async run(options: Options = {}): Promise<void> {
    const phpRepository = await this.database.getRepository(phpTYPE, PhpApplication);
    const repository = await this.database.getRepository(TYPE, Application);

    let page: Pagination = { limitStr: "100" };
    do {
      const applicationListResult = await phpRepository.find({}, { pagination: page });
      page = applicationListResult.nextPage as Pagination;

      for (const application of applicationListResult.getEntities()) {
        if (
          !(await repository.findOne({
            id: application.id,
          })) ||
          options.replaceExisting
        ) {
          const newApplication = importDepreciatedFields(application);
          await repository.save(newApplication);
        }
      }
    } while (page.page_token);
  }
}

const services = [
  "storage",
  "counter",
  "platform-services",
  "user",
  "search",
  "channels",
  "database",
  "webserver",
  "pubsub",
  "applications",
  "console",
  "auth",
];

const command: yargs.CommandModule<unknown, unknown> = {
  command: "application",
  describe: "command that allow you to migrate php applications to node",
  builder: {
    onlyApplication: {
      default: null,
      type: "string",
      description: "Migrate only this application ID",
    },
    replaceExisting: {
      default: false,
      type: "boolean",
      description: "Replace already migrated applications",
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handler: async argv => {
    const spinner = ora({ text: "Migrating php applications - " }).start();
    const platform = await twake.run(services);
    const migrator = new ApplicationMigrator(platform);

    const onlyApplication = argv.onlyApplication as string | null;
    const replaceExisting = (argv.replaceExisting || false) as boolean;

    await migrator.run({
      onlyApplication,
      replaceExisting,
    });

    return spinner.stop();
  },
};

export default command;

export const importDepreciatedFields = (application: PhpApplication): Application => {
  const newApplication = new Application();

  newApplication.id = application.id;
  newApplication.company_id = application.group_id;
  newApplication.is_default = application.is_default;

  if (!newApplication.identity?.name) {
    newApplication.identity = {
      name: application.depreciated_name,
      icon: application.depreciated_icon_url,
      description: application.depreciated_description,
      website: "http://twake.app/",
      categories: [],
      compatibility: ["twake"],
    };
  }

  if (newApplication.publication?.published === undefined) {
    //@ts-ignore
    newApplication.publication = newApplication.publication || {};
    newApplication.publication.published = application.depreciated_is_available_to_public;
    newApplication.publication.pending =
      application.depreciated_public && !application.depreciated_twake_team_validation;
  }

  if (!newApplication.stats?.version) {
    //@ts-ignore
    newApplication.stats = newApplication.stats || {};
    newApplication.stats.version = 1;
    newApplication.stats.createdAt = Date.now();
    newApplication.stats.updatedAt = Date.now();
  }

  if (!newApplication.api?.privateKey) {
    //@ts-ignore
    newApplication.api = newApplication.api || {};
    newApplication.api.hooksUrl = application.depreciated_api_events_url;
    newApplication.api.allowedIps = application.depreciated_api_allowed_ip;
    newApplication.api.privateKey = application.depreciated_api_private_key;
  }

  if (newApplication.access?.capabilities === undefined) {
    //@ts-ignore
    newApplication.access = newApplication.access || {};
    try {
      newApplication.access.capabilities =
        JSON.parse(application.depreciated_capabilities || "[]") || [];
    } catch (e) {
      newApplication.access.capabilities = [];
    }
    try {
      newApplication.access.privileges =
        JSON.parse(application.depreciated_privileges || "[]") || [];
    } catch (e) {
      newApplication.access.privileges = [];
    }
    try {
      newApplication.access.hooks = JSON.parse(application.depreciated_hooks || "[]") || [];
    } catch (e) {
      newApplication.access.hooks = [];
    }
  }

  if (!newApplication.display?.twake) {
    newApplication.display = newApplication.display || { twake: { version: 1 } };
    newApplication.display.twake = JSON.parse(application.depreciated_display_configuration) || {};
  }

  return newApplication;
};
