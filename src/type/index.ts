import { Tables } from "./database.types";

export type User = Tables<"profiles">;
export type Channel = Tables<"channels">;

export type ChannelWithUsers = Channel & { 
    profiles: User[];
    lastMessage?: Message | null; };

export type Message = Tables<"messages">;