import {UsersApi} from "services/Api/Users";
import {GeneralApi} from "services/Api/General";
import {WorkspacesApi} from "services/Api/Workspaces";

export default {
    general: GeneralApi,
    users : UsersApi,
    workspaces: WorkspacesApi,
};

