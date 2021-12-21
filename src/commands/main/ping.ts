import { Message } from 'discord.js';
import { Bot } from '../../Bot';
import { commandError } from '../../functions/ErrorHandler';
import { Command } from '../../interfaces';

export default class extends Command {
    constructor() {
        super('ping', 'BotのPing値とメモリ使用率を表示', 'ping', [], 'main');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async run(client: Bot, message: Message<boolean>, args: string[]): Promise<void> {
        try {
            const msg = await message.reply('Pong!');
            await msg.edit(`APIPing: ${msg.createdTimestamp - message.createdTimestamp}ms\nWebSocketPing: ${client.ws.ping}ms\nメモリ使用率: ${Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100}MB`);
        }
        catch (error) {
            commandError(client, message, error);
        }
    }
}