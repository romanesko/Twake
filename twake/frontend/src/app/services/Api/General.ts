import Api from "services/Api";
import {ServerInfoType} from "services/InitService";

export class GeneralApi {
    static getServerInfo() : Promise<ServerInfoType> {
        return Api.get('/internal/services/general/v1/server', null, false, {
            disableJWTAuthentication: true,
        }) as Promise<ServerInfoType>;
    }
}