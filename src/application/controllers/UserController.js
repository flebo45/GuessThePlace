import { SearchUser } from "../usecases/SearchUser";
import { appState } from "../state/AppState";


export const UserController = {

    async searchExtract(username) {
        return await SearchUser.byUsernameExtract(username);
    },

    async searchPrefix(prefix, limit) {
        return await SearchUser.byUsernamePrefix(prefix, limit);
    },

    async getUserById(id) {
        return await SearchUser.byUserId(id);
    },

    async getUserGamesHistory(id) {
        return await SearchUser.gamesHistory(id);
    },

    async toggleFollow(targetId) {
        const result = await  SearchUser.toggleFollow(appState.getUser(), targetId);
        if (result.status === "followed") {
            appState.getUser().follow(targetId);
        } else if (result.status === "unfollowed"){
            appState.getUser().unfollow(targetId);
        }
        return result;
    },

    async isFollowing(targetId) {
        return await SearchUser.isFollowing(appState.getUser(), targetId);
    }
};