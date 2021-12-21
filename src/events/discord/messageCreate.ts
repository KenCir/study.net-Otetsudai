import { Message } from 'discord.js';
import { Bot } from '../../Bot';
import { errorLog } from '../../functions/ErrorHandler';
import { getDayDate } from '../../utility/utility';

export async function run(client: Bot, message: Message): Promise<void> {
    try {
        if (message.author.bot || !message.guild || message.system) return;
        if (!message.content.startsWith(process.env.PREFIX as string)) return;
        const args = message.content.slice((process.env.PREFIX as string).length).trim().split(/ +/g);
        const command = (args.shift() as string).toLowerCase();
        if (!command) return;
        // eslint-disable-next-line no-shadow
        const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases.includes(command));
        if (!cmd) return;
        if ((cmd.category === 'owner' && message.author.id !== process.env.OWNERID) || (cmd.category === 'admin' && message.member?.permissions.has('ADMINISTRATOR'))) {
            await message.reply('このコマンドを実行するための権限が不足しています');
            return;
        }

        // もしデータがなければ登録する
        const dayDate = getDayDate();
        if (!client.database.getStudy(message.author.id, dayDate.year, dayDate.month, dayDate.day)) {
            client.database.initializeStudy(message.author.id, dayDate.year, dayDate.month, dayDate.day);
        }

        cmd.run(client, message, args);
    }
    catch (error) {
        errorLog(client, error);
    }
}