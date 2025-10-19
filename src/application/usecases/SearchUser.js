import { UserRepository } from "../../infrastructure/repositories/UserRepository";

export const SearchUser = {

    async byUsernameExtract(username) {
        if (!username || typeof username !== "string") return [];

        return await UserRepository.getUserByUsername(username.toLowerCase());
    },

    async byUsernamePrefix(prefix, limit = 10) {
        if (!prefix || typeof prefix !== "string") return [];

        return await UserRepository.findByUsernamePrefix(prefix.toLowerCase(), limit);
    }
};