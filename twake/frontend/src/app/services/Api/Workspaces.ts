import Api from "services/Api";

export class WorkspacesApi {

    private static prefix: string = '/internal/services/workspaces/v1'

    private static getPrefix(companyId: string){
        return this.prefix + `/companies/${companyId}/workspaces`;
    }


    static getAll(companyId: string) {
        return Api.get(
            `${this.getPrefix(companyId)}` ,
            null,
            false,
            { disableJWTAuthentication: true },
        ).then((a:any)=>a.resources);
    }

    static get(companyId: string, workspaceId: string){
        return Api.get(
            `${this.getPrefix(companyId)}/${workspaceId}` ,
            null,
            false,
            // { disableJWTAuthentication: true },
        ).catch(e=>{
          throw e;
        }).then((a:any)=> {

            const w = a.resource;

           const workspaceObject = {
                "id": "f339d54a-e833-11ea-92c3-0242ac120004",
                "company_id": "56393af2-e5fe-11e9-b894-0242ac120004",
                "name": "Software",
                "logo": "https://s3.eu-west-3.amazonaws.com/twake.eu-west-3/public/uploads/wslogo/2bb1d89d73e9597140d48fc095737f23.png",
                "default": false,
                "archived": false,
                "stats": {
                "created_at": 1598512040000,
                    "total_members": 110,
                    "total_guests": 1,
                    "total_pending": 20
            },
                "group": {
                "id": "56393af2-e5fe-11e9-b894-0242ac120004",
                    "name": " LINAGORA",
                    "logo": "https://s3.eu-west-3.amazonaws.com/twake.eu-west-3/public/uploads/grouplogo/dffc6bb54e7b5d6ee45d2d877839aa88.png",
                    "plan": null,
                    "stats": {
                    "total_members": "210",
                        "total_guests": "16",
                        "created_at": 1570121614000
                },
                "identity_provider": "console",
                    "identity_provider_id": "56393af2-e5fe-11e9-b894-0242ac120004",
                    "level": null
            },
                "user_level": {
                "id": "f342a594-e833-11ea-a658-0242ac120004",
                    "name": "User",
                    "admin": false,
                    "default": true,
                    "rights": []
            },
                "levels": [
                {
                    "id": "f341f630-e833-11ea-8ed0-0242ac120004",
                    "name": "Administrator",
                    "admin": true,
                    "default": false,
                    "rights": []
                },
                {
                    "id": "f342a594-e833-11ea-a658-0242ac120004",
                    "name": "User",
                    "admin": false,
                    "default": true,
                    "rights": []
                }
            ],
                "apps": [
                {
                    "id": "563ee7c2-e5fe-11e9-8323-0242ac120004",
                    "group_id": "56393af2-e5fe-11e9-b894-0242ac120004",
                    "app_id": "88bb9122-5b67-11e9-860f-0242ac120005",
                    "date_added": 1570121614,
                    "workspace_default": true,
                    "workspace_count": 63,
                    "workspace_id": "f339d54a-e833-11ea-92c3-0242ac120004",
                    "app": {
                        "id": "88bb9122-5b67-11e9-860f-0242ac120005",
                        "group_id": "480f11b4-4747-11e9-aa8e-0242ac120005",
                        "app_group_name": "",
                        "categories": [
                            "voice_video"
                        ],
                        "name": "Jitsi",
                        "simple_name": "jitsi",
                        "description": "Jitsi allows you to create and join video calls directly from Twake.",
                        "icon_url": "https://api.twake.app/bundle/connectors/jitsi/icon",
                        "website": "https://twake.app",
                        "install_count": 5605,
                        "creation_date": 1554883584,
                        "privileges": [],
                        "capabilities": [
                            "messages_send",
                            "display_modal",
                            "messages_save"
                        ],
                        "hooks": [],
                        "display": {
                            "messages_module": {
                                "right_icon": true,
                                "commands": [
                                    {
                                        "command": "Meeting name",
                                        "description": "Create a Jisti call"
                                    }
                                ]
                            }
                        },
                        "public": true,
                        "is_available_to_public": true
                    }
                },
                {
                    "id": "563ee90c-e5fe-11e9-8807-0242ac120004",
                    "group_id": "56393af2-e5fe-11e9-b894-0242ac120004",
                    "app_id": "8fadeb04-731a-11e9-9982-0242ac130005",
                    "date_added": 1570121614,
                    "workspace_default": true,
                    "workspace_count": 64,
                    "workspace_id": "f339d54a-e833-11ea-92c3-0242ac120004",
                    "app": {
                        "id": "8fadeb04-731a-11e9-9982-0242ac130005",
                        "group_id": "480f11b4-4747-11e9-aa8e-0242ac120005",
                        "app_group_name": "",
                        "categories": null,
                        "name": "Only Office",
                        "simple_name": "only_office",
                        "description": null,
                        "icon_url": "https://connectors.api.twake.app/icons/onlyoffice.png",
                        "website": null,
                        "install_count": 5569,
                        "creation_date": 1557489352,
                        "privileges": [
                            "workspace_drive"
                        ],
                        "capabilities": [
                            "drive_save",
                            "display_modal"
                        ],
                        "hooks": [],
                        "display": {
                            "drive_module": {
                                "can_open_files": {
                                    "url": "https://connectors.api.twake.app/only_office/load",
                                    "preview_url": "https://connectors.api.twake.app/only_office/load?preview=1",
                                    "main_ext": [
                                        "xlsx",
                                        "pptx",
                                        "docx",
                                        "xls",
                                        "ppt",
                                        "doc",
                                        "odt",
                                        "ods",
                                        "odp"
                                    ],
                                    "other_ext": [
                                        "txt",
                                        "html",
                                        "csv"
                                    ]
                                },
                                "can_create_files": [
                                    {
                                        "url": "https://connectors.api.twake.app/public/onlyoffice/empty.docx",
                                        "filename": "Untitled.docx",
                                        "name": "ONLYOFFICE Word Document"
                                    },
                                    {
                                        "url": "https://connectors.api.twake.app/public/onlyoffice/empty.xlsx",
                                        "filename": "Untitled.xlsx",
                                        "name": "ONLYOFFICE Excel Document"
                                    },
                                    {
                                        "url": "https://connectors.api.twake.app/public/onlyoffice/empty.pptx",
                                        "filename": "Untitled.pptx",
                                        "name": "ONLYOFFICE PowerPoint Document"
                                    }
                                ]
                            }
                        },
                        "public": true,
                        "is_available_to_public": false
                    }
                },
                {
                    "id": "563eec90-e5fe-11e9-8dcc-0242ac120004",
                    "group_id": "56393af2-e5fe-11e9-b894-0242ac120004",
                    "app_id": "9e03e584-a6df-11e9-9a80-0242ac130007",
                    "date_added": 1570121614,
                    "workspace_default": true,
                    "workspace_count": 61,
                    "workspace_id": "f339d54a-e833-11ea-92c3-0242ac120004",
                    "app": {
                        "id": "9e03e584-a6df-11e9-9a80-0242ac130007",
                        "group_id": "00000000-0000-1000-0000-000000000000",
                        "app_group_name": "twake",
                        "categories": null,
                        "name": "Tasks",
                        "simple_name": "twake_tasks",
                        "description": "Twake task management application.",
                        "icon_url": "/public/img/twake-emoji/twake-tasks.png",
                        "website": "https://twakeapp.com",
                        "install_count": 1283,
                        "creation_date": 1563181497,
                        "privileges": [],
                        "capabilities": [],
                        "hooks": [],
                        "display": {
                            "channel_tab": true,
                            "app": true
                        },
                        "public": true,
                        "is_available_to_public": true
                    }
                },
                {
                    "id": "494ac386-f00f-11e9-a7ac-0242ac120004",
                    "group_id": "56393af2-e5fe-11e9-b894-0242ac120004",
                    "app_id": "fab1e590-c33d-11e9-b38c-0242ac120004",
                    "date_added": 1571228405,
                    "workspace_default": false,
                    "workspace_count": 7,
                    "workspace_id": "f339d54a-e833-11ea-92c3-0242ac120004",
                    "app": {
                        "id": "fab1e590-c33d-11e9-b38c-0242ac120004",
                        "group_id": "480f11b4-4747-11e9-aa8e-0242ac120005",
                        "app_group_name": "",
                        "categories": [
                            "files"
                        ],
                        "name": "Google Drive",
                        "simple_name": "google_drive",
                        "description": "Create a Twake folder synchronised with your Google Drive.",
                        "icon_url": "https://connectors.albatros.twakeapp.com/icons/google_drive.png",
                        "website": "https://drive.google.com",
                        "install_count": 29,
                        "creation_date": 1566300657,
                        "privileges": [
                            "workspace_drive",
                            "drive_list"
                        ],
                        "capabilities": [
                            "drive_save",
                            "drive_remove",
                            "display_modal"
                        ],
                        "hooks": [
                            "file"
                        ],
                        "display": {
                            "drive_module": {
                                "can_connect_to_directory": true
                            }
                        },
                        "public": false,
                        "is_available_to_public": false
                    }
                },
                {
                    "id": "61ab77ac-b488-11ea-af52-0242ac130003",
                    "group_id": "56393af2-e5fe-11e9-b894-0242ac120004",
                    "app_id": "43c278f0-56e0-11e9-ab9d-0242ac120005",
                    "date_added": 1592830843,
                    "workspace_default": false,
                    "workspace_count": 32,
                    "workspace_id": "f339d54a-e833-11ea-92c3-0242ac120004",
                    "app": {
                        "id": "43c278f0-56e0-11e9-ab9d-0242ac120005",
                        "group_id": "480f11b4-4747-11e9-aa8e-0242ac120005",
                        "app_group_name": "",
                        "categories": null,
                        "name": "Simple Poll",
                        "simple_name": "poll",
                        "description": "Send a simple poll to your collaborators on Twake.",
                        "icon_url": "https://connectors.albatros.twakeapp.com/icons//simplepoll.png",
                        "website": null,
                        "install_count": 138,
                        "creation_date": 1554385682,
                        "privileges": [],
                        "capabilities": [
                            "display_modal",
                            "messages_save"
                        ],
                        "hooks": [],
                        "display": {
                            "messages_module": {
                                "commands": [
                                    {
                                        "command": "\"What do you want to eat?\" \"Pizza\" \"Pasta\" \"Tacos\"",
                                        "description": "Create a new poll"
                                    }
                                ]
                            }
                        },
                        "public": true,
                        "is_available_to_public": true
                    }
                },
                {
                    "id": "ef19d75e-e15c-11ea-bf8f-0242ac120004",
                    "group_id": "56393af2-e5fe-11e9-b894-0242ac120004",
                    "app_id": "3cc54d5e-65a2-11e9-8fce-0242ac120004",
                    "date_added": 1597759985,
                    "workspace_default": false,
                    "workspace_count": 4,
                    "workspace_id": "f339d54a-e833-11ea-92c3-0242ac120004",
                    "app": {
                        "id": "3cc54d5e-65a2-11e9-8fce-0242ac120004",
                        "group_id": "480f11b4-4747-11e9-aa8e-0242ac120005",
                        "app_group_name": "",
                        "categories": null,
                        "name": "Zapier",
                        "simple_name": "zapier",
                        "description": null,
                        "icon_url": "https://connectors.albatros.twakeapp.com/icons/zapier.png",
                        "website": null,
                        "install_count": 55,
                        "creation_date": 1556008309,
                        "privileges": [
                            "channels",
                            "workspace",
                            "drive_list",
                            "workspace_calendar",
                            "workspace_drive"
                        ],
                        "capabilities": [
                            "messages_save",
                            "drive_save",
                            "display_modal",
                            "calendar_event_save"
                        ],
                        "hooks": [
                            "event",
                            "message_in_workspace",
                            "file"
                        ],
                        "display": {
                            "configuration": {
                                "can_configure_in_workspace": true
                            },
                            "messages_module": {
                                "commands": [
                                    {
                                        "command": "[name] [content]",
                                        "description": "Zapier Controller"
                                    }
                                ]
                            }
                        },
                        "public": true,
                        "is_available_to_public": true
                    }
                },
                {
                    "id": "f4f52b7e-e15c-11ea-900e-0242ac120004",
                    "group_id": "56393af2-e5fe-11e9-b894-0242ac120004",
                    "app_id": "f2136a22-601d-11e9-a945-0242ac120005",
                    "date_added": 1597759995,
                    "workspace_default": false,
                    "workspace_count": 6,
                    "workspace_id": "f339d54a-e833-11ea-92c3-0242ac120004",
                    "app": {
                        "id": "f2136a22-601d-11e9-a945-0242ac120005",
                        "group_id": "480f11b4-4747-11e9-aa8e-0242ac120005",
                        "app_group_name": "",
                        "categories": null,
                        "name": "Incoming Webhooks",
                        "simple_name": "incoming_webhooks",
                        "description": "Incoming Webhooks allows you to easily send a message on a Twake channel from a third party service via a single link per channel.",
                        "icon_url": "https://connectors.albatros.twakeapp.com/icons/webhooks.svg",
                        "website": null,
                        "install_count": 95,
                        "creation_date": 1555401734,
                        "privileges": [],
                        "capabilities": [
                            "messages_send",
                            "display_modal",
                            "messages_save"
                        ],
                        "hooks": [],
                        "display": {
                            "channel": {
                                "can_connect_to_channel": true
                            },
                            "configuration": {
                                "can_configure_in_channel": true
                            }
                        },
                        "public": true,
                        "is_available_to_public": true
                    }
                },
                {
                    "id": "f76fa6fe-e15c-11ea-b45f-0242ac120004",
                    "group_id": "56393af2-e5fe-11e9-b894-0242ac120004",
                    "app_id": "e881895a-eb5d-11e9-98e2-0242ac120004",
                    "date_added": 1597759999,
                    "workspace_default": false,
                    "workspace_count": 4,
                    "workspace_id": "f339d54a-e833-11ea-92c3-0242ac120004",
                    "app": {
                        "id": "e881895a-eb5d-11e9-98e2-0242ac120004",
                        "group_id": "480f11b4-4747-11e9-aa8e-0242ac120005",
                        "app_group_name": "",
                        "categories": null,
                        "name": "n8n",
                        "simple_name": "n8n",
                        "description": "n8n connector",
                        "icon_url": "https://n8n.io/favicon.ico",
                        "website": "n8n.io",
                        "install_count": 148,
                        "creation_date": 1570712417,
                        "privileges": [
                            "channels",
                            "workspace",
                            "drive_list",
                            "workspace_calendar",
                            "workspace_drive",
                            "workspace_calendar",
                            "workspace_tasks",
                            "tasks_task_save",
                            "tasks_task_remove"
                        ],
                        "capabilities": [
                            "messages_save",
                            "drive_save",
                            "display_modal",
                            "calendar_event_save",
                            "tasks_task_save",
                            "tasks_task_save",
                            "tasks_task_remove"
                        ],
                        "hooks": [
                            "message_in_workspace",
                            "task",
                            "event",
                            "file",
                            "calendar"
                        ],
                        "display": {
                            "configuration": {
                                "can_configure_in_workspace": true
                            },
                            "messages_module": {
                                "commands": [
                                    {
                                        "command": "[name] [content]",
                                        "description": "n8n Controller"
                                    }
                                ]
                            }
                        },
                        "public": true,
                        "is_available_to_public": true
                    }
                },
                {
                    "id": "fa161848-e15c-11ea-a1dc-0242ac120004",
                    "group_id": "56393af2-e5fe-11e9-b894-0242ac120004",
                    "app_id": "0d01b53a-60e3-11e9-9534-0242ac120005",
                    "date_added": 1597760003,
                    "workspace_default": false,
                    "workspace_count": 5,
                    "workspace_id": "f339d54a-e833-11ea-92c3-0242ac120004",
                    "app": {
                        "id": "0d01b53a-60e3-11e9-9534-0242ac120005",
                        "group_id": "480f11b4-4747-11e9-aa8e-0242ac120005",
                        "app_group_name": "",
                        "categories": null,
                        "name": "Github Webhook",
                        "simple_name": "github_webhook",
                        "description": "Github Webhook allows you to receive Github events directly in a Twake channel.",
                        "icon_url": "https://connectors.albatros.twakeapp.com/icons/github.png",
                        "website": null,
                        "install_count": 27,
                        "creation_date": 1555486390,
                        "privileges": [],
                        "capabilities": [
                            "messages_send",
                            "display_modal",
                            "messages_save"
                        ],
                        "hooks": [],
                        "display": {
                            "channel": {
                                "can_connect_to_channel": true
                            },
                            "configuration": {
                                "can_configure_in_channel": true
                            }
                        },
                        "public": true,
                        "is_available_to_public": true
                    }
                },
                {
                    "id": "fe502c96-e15c-11ea-ab36-0242ac120004",
                    "group_id": "56393af2-e5fe-11e9-b894-0242ac120004",
                    "app_id": "10bb73ae-5b67-11e9-879d-0242ac120005",
                    "date_added": 1597760010,
                    "workspace_default": false,
                    "workspace_count": 5,
                    "workspace_id": "f339d54a-e833-11ea-92c3-0242ac120004",
                    "app": {
                        "id": "10bb73ae-5b67-11e9-879d-0242ac120005",
                        "group_id": "480f11b4-4747-11e9-aa8e-0242ac120005",
                        "app_group_name": "twake",
                        "categories": null,
                        "name": "RSS",
                        "simple_name": "rss",
                        "description": "Subscribe to an RSS feed and receive updates directly in a Twake channel.",
                        "icon_url": "https://connectors.albatros.twakeapp.com/icons/rss.png",
                        "website": null,
                        "install_count": 45,
                        "creation_date": 1554883383,
                        "privileges": [],
                        "capabilities": [
                            "messages_save"
                        ],
                        "hooks": [],
                        "display": {
                            "messages_module": {
                                "commands": [
                                    {
                                        "command": "add [url]",
                                        "description": "Subscribe to a RSS flux"
                                    },
                                    {
                                        "command": "list",
                                        "description": "List subscribed RSS flux"
                                    }
                                ]
                            }
                        },
                        "public": true,
                        "is_available_to_public": true
                    }
                },
                {
                    "id": "f5189c88-e6b3-11ea-a722-0242ac120004",
                    "group_id": "56393af2-e5fe-11e9-b894-0242ac120004",
                    "app_id": "2d3b5002-6045-11e9-8f74-0242ac120005",
                    "date_added": 1598347117,
                    "workspace_default": false,
                    "workspace_count": 6,
                    "workspace_id": "f339d54a-e833-11ea-92c3-0242ac120004",
                    "app": {
                        "id": "2d3b5002-6045-11e9-8f74-0242ac120005",
                        "group_id": "480f11b4-4747-11e9-aa8e-0242ac120005",
                        "app_group_name": "",
                        "categories": null,
                        "name": "Gitlab",
                        "simple_name": "gitlab",
                        "description": "Gitlab Webhook allows you to receive gitlab events directly in a Twake channel.",
                        "icon_url": "https://connectors.albatros.twakeapp.com/icons/gitlab.png",
                        "website": null,
                        "install_count": 56,
                        "creation_date": 1555418583,
                        "privileges": [],
                        "capabilities": [
                            "messages_send",
                            "display_modal",
                            "messages_save"
                        ],
                        "hooks": [],
                        "display": {
                            "channel": {
                                "can_connect_to_channel": true
                            },
                            "configuration": {
                                "can_configure_in_channel": true
                            },
                            "messages_module": {
                                "commands": [
                                    {
                                        "command": "create issue \"title\" \"description\"",
                                        "description": "Create an issue on gitlab"
                                    }
                                ]
                            }
                        },
                        "public": true,
                        "is_available_to_public": true
                    }
                }
            ],
                "members": [],
                "maxWorkspace": null
            };

            return workspaceObject;

        });
    }


}