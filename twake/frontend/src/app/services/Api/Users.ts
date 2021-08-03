import {UserType} from "app/models/User";
import Api from "services/Api";
import RouterServices from "services/RouterService";
import {JWTDataType} from "services/JWTStorage";
import ApiService from "services/ApiService";
import workspaces from "services/workspaces/workspaces";
import {CompanyType} from "app/models/Company";

export class UsersApi {

    private static prefix: string = '/internal/services/users/v1/users'
    private static consolePrefix: string = '/internal/services/console/v1'

    static async getCurrent() {
        let user = await Api.get(
            `${this.prefix}/me?timezone=` + new Date().getTimezoneOffset(),
            null,
            false,
            {disableJWTAuthentication: true},
        ).then((a: any) => {
            if (a.statusCode && a.statusCode > 399) {
                throw new Error(a.message);
            }
            return a.resource;
        });

        const userCompaniesIds = user.companies.map((c: any) => c.company.id);
        const userWorkspacesIds: string[] = [];

        const userWorkspaces: any[] = [];

        const companies = await this.companies(user.id);


        for (const company of companies) {

            const workspaces = await ApiService.workspaces.getAll(company.id);
            workspaces.forEach((w: any) => {
                userWorkspacesIds.push(w.id);

                userWorkspaces.push( {
                    "id": w.id,
                    "company_id": w.company_id,
                    "name": w.name,
                    "logo": w.logo,
                    "default": w.default,
                    "archived": w.archived,
                    "stats": {
                        "created_at": w.stats.created_at,
                        "total_members": w.stats.total_members,
                        "total_guests": 0,
                        "total_pending": 0
                    },
                    "group": {
                        "id": company.id,
                        "name": company.name,
                        "logo": company.logo,
                        "plan": company.plan,
                        "stats": {
                            "total_members": "209",
                            "total_guests": "15",
                            "created_at": 1570121614000
                        },
                        "identity_provider": "console",
                        "identity_provider_id": "56393af2-e5fe-11e9-b894-0242ac120004"
                    },
                    "_user_last_access": 1603981350,
                    "_user_hasnotifications": false,
                    "_user_is_guest": w.role === "guest",
                    "_user_is_organization_administrator": company.role === "admin",
                    "_user_is_admin": w.role === "admin"
                },);


            });
        }

        // TODO: remove Hardcode

        const oldStyleUser = {
            id: user.id,
            username: user.username,
            firstname: user.first_name,
            lastname: user.last_name,
            thumbnail: user.picture,
            identity_provider: user.provider,
            connected: false, // ???
            language: 'en',
            "isNew": false,
            "isRobot": false,
            "status_icon": ["", ""],
            "front_id": "1603981311dfb42bf57ba39c58506536e7387abccd8c23c9ad",
            "timezone_offset": user.preference.timezone,
            "email": user.email,
            "mail_hash": "bd4f4078a22a80a5be34ae2293698eca",
            "mail_verification_override": null,
            "mail_verification_override_mail": null,
            "groups_id": userCompaniesIds,
            "workspaces_id": userWorkspacesIds,
            "deleted": false,
            "provider": user.provider,
            "provider_id": user.provider_id,
            "is_verified": user.is_verified,
            "picture": user.picture,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "created_at": user.created_at,
            "preference": {
                "locale": user.preference.locale,
                "timezone": user.preference.timezone
            },
            "status": "",
            "last_activity": user.last_activity,
            "notifications_preferences": {
                "devices": 0,
                "dont_disturb_between": null,
                "dont_disturb_and": null,
                "privacy": 0,
                "dont_use_keywords": 1,
                "keywords": "",
                "disabled_workspaces": [],
                "workspace": [],
                "mail_notifications": 2,
                "disable_until": 0
            },
            "tutorial_status": {
                "no_tuto": true,
                "first_message_sent": true,
                "has_identity": true,
                "has_desktop_app": true
            },
            "mails": [
                {
                    "id": "2deb1d3a-19f2-11eb-87a1-0242ac120004",
                    "main": true,
                    "email": user.email
                }
            ],
            workspaces:userWorkspaces,
            companies
        };


        return oldStyleUser;
    }

    static companies(userId: string): Promise<CompanyType[]>{
        return Api.get(`${this.prefix}/${userId}/companies`).then((a:any)=>a.resources);
    }

    static getByIds(users: string[]): Promise<UserType[]> {
        return Api.get(`${this.prefix}?user_ids=${users.join(',')}`
        ).then((res: any) => {
            return res.resources && res.resources.length ? res.resources : [];
        });
    }

    static login(email: string, password: string, rememberMe: boolean): Promise<JWTDataType> {
        return Api.post(
            `${this.consolePrefix}/login`,
            {
                email,
                password,
                remember_me: rememberMe,
                device: {},
            },
            null,
            false,
            {disableJWTAuthentication: true},
        ).then((res: any) => {
            return res.access_token as JWTDataType;
        });
    }
}