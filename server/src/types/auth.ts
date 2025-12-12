import type { User } from "./user.js";

export interface AuthTokens{
    accessToken: string;
    user: User;
}