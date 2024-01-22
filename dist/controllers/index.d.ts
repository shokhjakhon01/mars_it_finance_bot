import { Bot } from "grammy";
declare class Controllers {
    private bot;
    private studentInfo;
    private cronJob;
    constructor(bot: Bot);
    private scheduleExpiredPostsCheck;
    private sendExpiredPostToGroup;
    private formatPostInfo;
    handleText(): Promise<void>;
    private formatUserInfo;
    private sendFormattedInfo;
    private handleConfirmation;
    private saveAndSendToGroup;
    private startAgain;
}
export default function createControllers(bot: Bot): Controllers;
export {};
