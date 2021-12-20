import { Bot } from '../../Bot';
import { errorLog } from '../../functions/ErrorHandler';

export function run(client: Bot): void {
    try {
        client.user?.setActivity(`${process.env.PREFIX}help`);
        client.logger.info(`Logged in as ${client.user?.tag}`);
    }
    catch (error) {
        errorLog(client, error);
    }
}