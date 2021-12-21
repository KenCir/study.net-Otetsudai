import { codeBlock } from '@discordjs/builders';
import { Message, MessageActionRow, MessageButton } from 'discord.js';
import { inspect } from 'util';
import { Bot } from '../../Bot';
import { commandError } from '../../functions/ErrorHandler';
import { Command } from '../../interfaces';

export default class extends Command {
    constructor() {
        super('eval', '簡易プログラムをテストする', '[code]', [], 'owner');
    }

    async run(client: Bot, message: Message<boolean>, args: string[]): Promise<void> {
        try {
            if (args.length < 1) {
                await message.reply('簡易プログラムのコードを引数に入れてください');
                return;
            }

            const msg: Message = await message.reply({
                content: `${codeBlock('以下のコードを実行してもいいですか？\n実行していい場合はokを、キャンセルする場合はnoボタンを押してください\n30秒経つと強制キャンセルされます')}${codeBlock('js', args.join(' '))}`,
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('ok')
                                .setEmoji('810436146718441483')
                                .setStyle('PRIMARY'),
                            new MessageButton()
                                .setCustomId('no')
                                .setEmoji('810436146978619392')
                                .setStyle('PRIMARY'),
                        ),
                ],
            });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
            const filter = (i: any) => (i.customId === 'ok' || i.customId === 'no') && i.user.id === message.author.id;
            const response = await msg.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 });
            if (response.customId === 'no') {
                await response.update({
                    content: 'キャンセルしました',
                    components: [],
                });
            }
            else if (response.customId === 'ok') {
                let evaled;
                try {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    evaled = await eval(args.join(' '));
                    const evalinspect = inspect(evaled);
                    if (evalinspect.length <= 4000) {
                        await response.update({
                            content: codeBlock(evalinspect),
                            components: [],
                        });
                    }
                    else {
                        await response.update({
                            content: '実行結果が4000文字を超えているため送信出来ません',
                            components: [],
                        });
                    }
                }
                catch (error) {
                    await response.update(
                        {
                            content: `ERROR!\n${codeBlock(((error as Error).stack as string))}`,
                            components: [],
                        },
                    );
                }
            }
        }
        catch (error) {
            commandError(client, message, error);
        }
    }
}