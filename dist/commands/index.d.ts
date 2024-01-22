import { Bot } from "grammy";
declare class Commands {
    private bot;
    constructor(bot: Bot);
    help(): void;
    start(): void;
}
export default function createcommmands(bot: Bot): Commands;
export {};
