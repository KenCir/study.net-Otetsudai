import { Message, MessageEmbed } from 'discord.js';
import { Bot } from '../Bot';

function errorLog(client: Bot, error: unknown): void {
    client.logger.error(error);
}

async function commandError(client: Bot, message: Message, error: unknown): Promise<void> {
    client.logger.error(error);
    await message.reply({
        embeds: [
            new MessageEmbed()
                .setTitle('ERROR')
                .setDescription((error as Error).stack as string)
                .setColor('RED'),
        ],
    });
}

export {
    errorLog,
    commandError,
};