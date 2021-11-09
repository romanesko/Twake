import { CrudController } from "../../../../core/platform/services/webserver/types";
import {
  ResourceCreateResponse,
  ResourceDeleteResponse,
  ResourceGetResponse,
  ResourceListResponse,
} from "../../../../utils/types";
import WorkspaceServicesAPI from "../../api";
import {
  WorkspaceInviteTokenDeleteRequest,
  WorkspaceInviteTokenGetRequest,
  WorkspaceInviteTokenObject,
  WorkspaceJoinByTokenRequest,
  WorkspaceJoinByTokenResponse,
} from "../types";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { WorkspaceInviteTokensExecutionContext } from "../../types";
import { CrudExeption } from "../../../../core/platform/framework/api/crud-service";
import WorkspaceInviteTokens from "../../entities/workspace_invite_tokens";
import Workspace from "../../entities/workspace";
import { pick } from "lodash";

export class WorkspaceInviteTokensCrudController
  implements
    CrudController<
      ResourceGetResponse<WorkspaceInviteTokenObject>,
      ResourceCreateResponse<WorkspaceInviteTokenObject>,
      ResourceListResponse<WorkspaceInviteTokenObject>,
      ResourceDeleteResponse
    >
{
  constructor(protected services: WorkspaceServicesAPI) {
    this.services = services;
  }

  async list(
    request: FastifyRequest<{ Params: WorkspaceInviteTokenGetRequest }>,
    reply: FastifyReply,
  ): Promise<ResourceListResponse<WorkspaceInviteTokenObject>> {
    const context = getExecutionContext(request);

    const res = await this.services.workspaces.getInviteToken(
      context.company_id,
      context.workspace_id,
    );

    if (!res) {
      throw CrudExeption.notFound("Invite token not found");
    }

    return {
      resources: [{ token: res.token }],
    };
  }

  async save(
    request: FastifyRequest<{ Params: WorkspaceInviteTokenGetRequest }>,
    reply: FastifyReply,
  ): Promise<ResourceGetResponse<WorkspaceInviteTokenObject>> {
    const context = getExecutionContext(request);

    const res = await this.services.workspaces.createInviteToken(
      context.company_id,
      context.workspace_id,
    );

    return {
      resource: { token: res.token },
    };
  }

  async delete(
    request: FastifyRequest<{ Params: WorkspaceInviteTokenDeleteRequest }>,
    reply: FastifyReply,
  ): Promise<ResourceDeleteResponse> {
    const context = getExecutionContext(request);

    const deleted = await this.services.workspaces.deleteInviteToken(
      context.company_id,
      context.workspace_id,
    );

    if (!deleted) {
      throw CrudExeption.notFound("Invite token not found");
    }

    reply.code(204);

    return {
      status: "success",
    };
  }

  async join(
    request: FastifyRequest<{ Body: WorkspaceJoinByTokenRequest }>,
    reply: FastifyReply,
  ): Promise<ResourceGetResponse<WorkspaceJoinByTokenResponse>> {
    const entity = await this.services.workspaces.getInviteTokenInfo(request.body.token);

    if (!entity) {
      throw CrudExeption.notFound("Token not found");
    }

    const { company_id, workspace_id } = entity;

    const [company, workspace] = await Promise.all([
      this.services.companies.getCompany({ id: company_id }),
      this.services.workspaces.get({
        company_id: company_id,
        id: workspace_id,
      }),
    ]);

    const resource: WorkspaceJoinByTokenResponse = {
      company: { name: company.name },
      workspace: { name: workspace.name },
    };

    if (!request.currentUser) {
      resource.auth_url = "link to authorization";
    } else {
      if (request.body.join) {
        const user_id = request.currentUser.id;

        const companyUser = await this.services.companies.getCompanyUser(
          { id: company_id },
          { id: user_id },
        );
        if (!companyUser) {
          await this.services.companies.setUserRole(company_id, user_id, "member");
        }

        const workspaceUser = await this.services.workspaces.getUser({
          workspaceId: workspace.id,
          userId: user_id,
        });
        if (!workspaceUser) {
          await this.services.workspaces.addUser(
            pick(workspace, ["company_id", "id"]),
            { id: user_id },
            "member",
          );
        }
        resource.company.id = company.id;
        resource.workspace.id = workspace.id;
      }
    }

    return { resource };
  }
}

function getExecutionContext(
  request: FastifyRequest<{ Params: WorkspaceInviteTokenGetRequest }>,
): WorkspaceInviteTokensExecutionContext {
  return {
    user: request.currentUser,
    company_id: request.params.company_id,
    workspace_id: request.params.workspace_id,
    url: request.url,
    method: request.routerMethod,
    transport: "http",
  };
}
