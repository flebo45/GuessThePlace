import { User } from "../../domain/entities/User";
import { GameRepository } from "../../infrastructure/repositories/GameRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";

export const SearchUser = {

    async byUsernameExtract(username) {
        if (!username || typeof username !== "string") return [];

        return await UserRepository.getUserByUsername(username.toLowerCase());
    },

    async byUsernamePrefix(prefix, limit = 10) {
        if (!prefix || typeof prefix !== "string") return [];

        return await UserRepository.findByUsernamePrefix(prefix.toLowerCase(), limit);
    },

    async byUserId(userId) {
        return await UserRepository.getUserById(userId);
    },

    async gamesHistory(userId) {
        return await GameRepository.getGamesByUserId(userId);
    },

    async toggleFollow(currentUser, targetId) {
        const isFollowing = currentUser.isFollowing(targetId);
        if (isFollowing) {
            await UserRepository.unfollowUser(currentUser.id, targetId);
            return { status: "unfollowed"};
        } else {
            await UserRepository.followUser(currentUser.id, targetId);
            return { status: "followed" };
        }
    },

    async isFollowing(currentUser, targetId) {
        return currentUser.isFollowing(targetId);
    }
};