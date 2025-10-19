import { SearchUser } from "../usecases/SearchUser";

export const UserController = {

    async searchExtract(username) {
        return await SearchUser.byUsernameExtract(username);
    },

    async searchPrefix(prefix, limit) {
        return await SearchUser.byUsernamePrefix(prefix, limit);
    }
};