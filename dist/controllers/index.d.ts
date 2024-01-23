import { Bot } from "grammy";
declare class Controllers {
    private bot;
    private studentInfo;
    private post_id;
    private cronJob;
    private sendingPostInfo;
    constructor(bot: Bot);
    private scheduleExpiredPostsCheck;
    private sendExpiredPostToGroup;
    private formatPostInfo;
    handleText(): Promise<void>;
    private sendFormattedInfo;
    private handleConfirmation;
    private saveAndSendToGroup;
    private startAgain;
}
export default function createControllers(bot: Bot): Controllers;
export {};
