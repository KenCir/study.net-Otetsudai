import { Message } from 'discord.js';
import { Bot } from '../../Bot';
import { commandError } from '../../functions/ErrorHandler';
import { Command } from '../../interfaces';

export default class extends Command {
    constructor() {
        super('shutdown', 'Botをシャットダウン', '', [], 'owner');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async run(client: Bot, message: Message<boolean>, args: string[]): Promise<void> {
        try {
            await message.reply('シャットダウンしています...');
            process.exit();
        }
        catch (error) {
            commandError(client, message, error);
        }
    }
}