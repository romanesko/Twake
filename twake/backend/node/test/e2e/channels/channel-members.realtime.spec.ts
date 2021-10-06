import { describe, expect, it, beforeEach, afterEach } from "@jest/globals";
import { v4 as uuidv4, v1 as uuidv1 } from "uuid";
import { deserialize } from "class-transformer";
import { TestPlatform, init } from "../setup";
import ChannelServiceAPI from "../../../src/services/channels/provider";
import { Channel } from "../../../src/services/channels/entities/channel";
import { ChannelMember } from "../../../src/services/channels/entities/channel-member";
import { ChannelExecutionContext, ChannelVisibility } from "../../../src/services/channels/types";
import { WorkspaceExecutionContext } from "../../../src/services/channels/types";
import { ResourceGetResponse, ResourceListResponse, User } from "../../../src/utils/types";
import UserServiceAPI from "../../../src/services/user/api";
import UserEntity from "../../../src/services/user/entities/user";
import { TestDbService, uuid } from "../utils.prepare.db";

import Workspace, {
  getInstance as getWorkspaceInstance,
  WorkspacePrimaryKey,
} from "../../../src/services/workspaces/entities/workspace";

describe("The ChannelMembers REST API", () => {
  const url = "/internal/services/channels/v1";
  let platform: TestPlatform;
  let channelService: ChannelServiceAPI;
  // let userService: UserServiceAPI;
  let testDbService: TestDbService;

  beforeAll(async ends => {
    platform = await init({
      services: [
        "websocket",
        "webserver",
        "channels",
        "auth",
        "database",
        "user",
        "search",
        "storage",
        "counter",
        "pubsub",
        "console",
        "platform-services",
        "workspaces",
      ],
    });
    await platform.database.getConnector().drop();
    channelService = platform.platform.getProvider<ChannelServiceAPI>("channels");
    testDbService = new TestDbService(platform);
    await testDbService.createCompany(platform.workspace.company_id);
    const ws0pk = {
      id: platform.workspace.workspace_id,
      company_id: platform.workspace.company_id,
    };
    await testDbService.createWorkspace(ws0pk);
    await testDbService.createUser([ws0pk], { id: platform.currentUser.id });
    ends();
  });

  afterAll(async ends => {
    await platform.tearDown();
    platform = null;
    ends();
  });

  function getWorkspaceContext(user?: User): WorkspaceExecutionContext {
    return {
      workspace: platform.workspace,
      user: user || platform.currentUser,
    };
  }

  function getContext(channel: Channel, user?: User): ChannelExecutionContext {
    return {
      channel,
      user,
    };
  }

  /**
   * Get a new channel instance
   *
   * @param owner will be a random uuidv4 if not defined
   */
  function getChannel(owner: string = uuidv1(), visibility = ChannelVisibility.PRIVATE): Channel {
    const channel = new Channel();

    channel.name = "Test Channel";
    channel.company_id = platform.workspace.company_id;
    channel.workspace_id = platform.workspace.workspace_id;
    channel.is_default = false;
    channel.visibility = visibility;
    channel.archived = false;
    channel.owner = owner;

    return channel;
  }

  function getMember(channel: Channel, user: User): ChannelMember {
    const member = new ChannelMember();

    member.company_id = platform.workspace.company_id;
    member.workspace_id = platform.workspace.workspace_id;
    member.channel_id = channel?.id;
    member.user_id = user?.id;

    return member;
  }

  const rand = () => Math.floor(Math.random() * 100000);

  // function getUser(): UserEntity {
  //   const user = new UserEntity();
  //   user.id = uuidv1();
  //   user.first_name = "user" + rand();
  //   return user;
  // }

  describe("The GET / - Get members list", () => {
    let channel: Channel;
    let createdChannel: Channel;

    beforeEach(async () => {
      channel = getChannel(platform.currentUser.id);
      createdChannel = (await channelService.channels.save(channel, {}, getWorkspaceContext()))
        .entity;
    });

    it("should 404 when channel does not exists", async done => {
      const jwtToken = await platform.auth.getJWTToken();
      const response = await platform.app.inject({
        method: "GET",
        url: `${url}/companies/${platform.workspace.company_id}/workspaces/${
          platform.workspace.workspace_id
        }/channels/${uuidv1()}/members`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      const result: ResourceListResponse<ChannelMember> = deserialize(
        ResourceListResponse,
        response.body,
      );

      expect(response.statusCode).toBe(404);
      done();
    });

    it("should return list of members", async done => {
      // const member = getMember(createdChannel, platform.currentUser);
      // const memberCreationResult = await channelService.members.save(
      //   member,
      //   {},
      //   getContext(channel, platform.currentUser),
      // );

      const jwtToken = await platform.auth.getJWTToken();
      const response = await platform.app.inject({
        method: "GET",
        url: `${url}/companies/${platform.workspace.company_id}/workspaces/${platform.workspace.workspace_id}/channels/${createdChannel.id}/members`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      const result: ResourceListResponse<ChannelMember> = deserialize(
        ResourceListResponse,
        response.body,
      );

      expect(response.statusCode).toBe(200);
      expect(result.resources.length).toEqual(1);
      expect(result.resources[0]).toMatchObject({
        channel_id: createdChannel.id,
        workspace_id: platform.workspace.workspace_id,
        company_id: platform.workspace.company_id,
        user_id: platform.currentUser.id,
        type: "member",
      });

      done();
    });
  });

  describe.only("The POST / - Add member", () => {
    let createdChannel: Channel;

    beforeAll(async done => {
      createdChannel = (await channelService.channels.save(getChannel(), {}, getWorkspaceContext()))
        .entity;
      done();
    });

    it("should fail when user_id is not defined", async done => {
      const jwtToken = await platform.auth.getJWTToken();
      const response = await platform.app.inject({
        method: "POST",
        url: `${url}/companies/${platform.workspace.company_id}/workspaces/${platform.workspace.workspace_id}/channels/${createdChannel.id}/members`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
        payload: {
          resource: {},
        },
      });

      expect(response.statusCode).toEqual(400);

      done();
    });

    it.only("should be able to add current member", async done => {
      const jwtToken = await platform.auth.getJWTToken();
      const response = await platform.app.inject({
        method: "POST",
        url: `${url}/companies/${platform.workspace.company_id}/workspaces/${platform.workspace.workspace_id}/channels/${createdChannel.id}/members`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
        payload: {
          resource: {
            user_id: platform.currentUser.id,
          },
        },
      });

      expect(response.statusCode).toEqual(201);

      done();
    });

    it("should be able to add another member", async done => {
      const user = await testDbService.createUser();

      const jwtToken = await platform.auth.getJWTToken();
      const response = await platform.app.inject({
        method: "POST",
        url: `${url}/companies/${platform.workspace.company_id}/workspaces/${platform.workspace.workspace_id}/channels/${createdChannel.id}/members`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
        payload: {
          resource: {
            user_id: user.id,
          },
        },
      });

      expect(response.statusCode).toEqual(201);
      done();
    });

    it("check channels counter", async done => {
      const user = await testDbService.createUser();

      const jwtToken = await platform.auth.getJWTToken();
      const response = await platform.app.inject({
        method: "GET",
        url: `${url}/companies/${platform.workspace.company_id}/workspaces/${platform.workspace.workspace_id}/channels`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      expect(response.statusCode).toEqual(200);

      const resources = response.json()["resources"];

      expect(resources.length).toEqual(1);

      const channel = resources[0];

      expect(channel).toEqual(
        expect.objectContaining({
          members_count: 0,
          guests_count: 0,
          messages_count: 0,
        }),
      );

      done();
    });
  });

  describe.skip("The GET /:member_id - Get a member", () => {
    let channel: Channel;
    let createdChannel: Channel;

    beforeAll(async done => {
      channel = getChannel();
      createdChannel = (await channelService.channels.save(channel, {}, getWorkspaceContext()))
        .entity;
      done();
    });

    it("should 404 when member does not exist", async done => {
      const jwtToken = await platform.auth.getJWTToken();
      const response = await platform.app.inject({
        method: "GET",
        url:
          `${url}/companies/${platform.workspace.company_id}/workspaces/` +
          `${platform.workspace.workspace_id}/channels/${createdChannel.id}/members/${uuidv1()}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      expect(response.statusCode).toEqual(404);
      done();
    });

    it("should send back member", async done => {
      const member = getMember(createdChannel, platform.currentUser);
      const memberCreationResult = await channelService.members.save(
        member,
        {},
        getContext(channel),
      );
      const jwtToken = await platform.auth.getJWTToken();
      const response = await platform.app.inject({
        method: "GET",
        url: `${url}/companies/${platform.workspace.company_id}/workspaces/${platform.workspace.workspace_id}/channels/${createdChannel.id}/members/${memberCreationResult.entity.user_id}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      expect(response.statusCode).toEqual(200);
      const result: ResourceGetResponse<ChannelMember> = deserialize(
        ResourceGetResponse,
        response.body,
      );

      expect(response.statusCode).toBe(200);
      expect(result.resource).toMatchObject({
        channel_id: memberCreationResult.entity.channel_id,
        workspace_id: memberCreationResult.entity.workspace_id,
        company_id: memberCreationResult.entity.company_id,
        user_id: memberCreationResult.entity.user_id,
      });

      done();
    });
  });

  describe("The POST /:member_id - Update a member", () => {
    let channel: Channel;
    let createdChannel: Channel;
    let anotherUser: UserEntity;

    beforeAll(async done => {
      channel = getChannel();
      createdChannel = (await channelService.channels.save(channel, {}, getWorkspaceContext()))
        .entity;

      const jwtToken = await platform.auth.getJWTToken();

      anotherUser = await testDbService.createUser();

      await platform.app.inject({
        method: "POST",
        url: `${url}/companies/${platform.workspace.company_id}/workspaces/${platform.workspace.workspace_id}/channels/${createdChannel.id}/members`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
        payload: {
          resource: {
            user_id: anotherUser.id,
          },
        },
      });

      done();
    });

    it("should not be able to update a member when current user is not the member", async done => {
      const jwtToken = await platform.auth.getJWTToken();

      const response = await platform.app.inject({
        method: "POST",
        url: `${url}/companies/${platform.workspace.company_id}/workspaces/${platform.workspace.workspace_id}/channels/${createdChannel.id}/members/${anotherUser.id}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
        payload: {
          resource: {
            favorite: true,
          },
        },
      });

      expect(response.statusCode).toEqual(400);
      done();
    });

    it("should be able to update member when current user is the member", async done => {
      const member = getMember(createdChannel, platform.currentUser);

      const jwtToken = await platform.auth.getJWTToken();
      const response = await platform.app.inject({
        method: "POST",
        url: `${url}/companies/${platform.workspace.company_id}/workspaces/${platform.workspace.workspace_id}/channels/${createdChannel.id}/members/${platform.currentUser.id}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
        payload: {
          resource: {
            favorite: true,
          },
        },
      });

      expect(response.statusCode).toEqual(200);

      const channelMember: ChannelMember = await channelService.members.get(
        member,
        getContext(channel),
      );

      expect(channelMember).toMatchObject({
        channel_id: createdChannel.id,
        workspace_id: platform.workspace.workspace_id,
        company_id: platform.workspace.company_id,
        user_id: platform.currentUser.id,
        favorite: true,
      });

      done();
    });
  });

  describe("The DELETE /:member_id - Remove a member", () => {
    let channel: Channel;
    let createdChannel: Channel;
    let ws0pk: WorkspacePrimaryKey;

    beforeEach(async () => {
      ws0pk = {
        id: platform.workspace.workspace_id,
        company_id: platform.workspace.company_id,
      };
      channel = getChannel(platform.currentUser.id);
      createdChannel = (await channelService.channels.save(channel, {}, getWorkspaceContext()))
        .entity;
    });

    it("should 404 when member does not exist", async done => {
      const jwtToken = await platform.auth.getJWTToken();
      const response = await platform.app.inject({
        method: "DELETE",
        url: `${url}/companies/${platform.workspace.company_id}/workspaces/${
          platform.workspace.workspace_id
        }/channels/${createdChannel.id}/members/${uuidv1()}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
        payload: {
          resource: {
            favorite: true,
          },
        },
      });

      expect(response.statusCode).toEqual(404);
      done();
    });

    it("should not be able to remove the member when current user does not have enough rights", async done => {
      const member = getMember(createdChannel, { id: uuidv4() });

      await testDbService.createUser([ws0pk], { id: member.user_id });

      const memberCreationResult = await channelService.members.save(
        member,
        {},
        getContext(channel, platform.currentUser),
      );
      const jwtToken = await platform.auth.getJWTToken({ sub: uuidv1() });
      const response = await platform.app.inject({
        method: "DELETE",
        url: `${url}/companies/${platform.workspace.company_id}/workspaces/${platform.workspace.workspace_id}/channels/${createdChannel.id}/members/${memberCreationResult.entity.user_id}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      expect(response.statusCode).toEqual(400);
      done();
    });

    it("should be able to remove the member when current user is the member", async done => {
      const member = getMember(createdChannel, { id: uuidv4() });
      await testDbService.createUser([ws0pk], { id: member.user_id });
      const memberCreationResult = await channelService.members.save(
        member,
        {},
        getContext(channel, platform.currentUser),
      );
      const jwtToken = await platform.auth.getJWTToken();
      const response = await platform.app.inject({
        method: "DELETE",
        url: `${url}/companies/${platform.workspace.company_id}/workspaces/${platform.workspace.workspace_id}/channels/${createdChannel.id}/members/${memberCreationResult.entity.user_id}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      expect(response.statusCode).toEqual(204);
      done();
    });
  });
});
