import { codeBlock } from '@discordjs/builders';
import { Message, MessageEmbed } from 'discord.js';
import { Bot } from '../../Bot';
import { Command, Study } from '../../interfaces';
import { getDayDate } from '../../utility/utility';

export default class extends Command {
    constructor() {
        super('graph', '勉強時間をグラフで表示', '', [], 'study');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async run(client: Bot, message: Message<boolean>, args: string[]): Promise<void> {
        const dayDate = getDayDate();
        const studyData: Study | undefined = client.database.getStudy(message.author.id, dayDate.year, dayDate.month, dayDate.day);
        if (!studyData) return;

        await message.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle('本日の勉強時間')
                    .setDescription(codeBlock('diff', `+ ${studyData.time}分`))
                    .setColor('RANDOM'),
            ],
        });
    }
}