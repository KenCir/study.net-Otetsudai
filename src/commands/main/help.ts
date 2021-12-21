import { codeBlock } from '@discordjs/builders';
import { Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { Bot } from '../../Bot';
import { commandError } from '../../functions/ErrorHandler';
import { Command } from '../../interfaces';

export default class extends Command {
    constructor() {
        super('help', '全コマンドを表示する', '(コマンド名)', [], 'main');
    }

    async run(client: Bot, message: Message<boolean>, args: string[]): Promise<void> {
        try {
            if (!args[0]) {
                const embeds: Array<MessageEmbed> = [];
                embeds.push(
                    new MessageEmbed()
                        .setTitle('何か御用でしょうか？')
                        .addField('メインコマンド', client.commands.filter(x => x.category == 'main').map((x) => '`' + x.name + '`').join(', '))
                        .setColor('RANDOM'),
                    new MessageEmbed()
                        .setTitle('メインコマンド')
                        .setDescription(codeBlock(client.commands.filter(x => x.category == 'main').map((x) => `${process.env.PREFIX}${x.name} ${x.usage}: ${x.description}`).join('\n')))
                        .setColor('RANDOM'),
                );
                if (message.author.id === process.env.OWNERID) {
                    embeds.push(
                        new MessageEmbed()
                            .setTitle('Bot管理者コマンド')
                            .setDescription(codeBlock(client.commands.filter(x => x.category == 'owner').map((x) => `${process.env.PREFIX}${x.name} ${x.usage}: ${x.description}`).join('\n')))
                            .setColor('RANDOM'),
                    );
                }

                let select = 0;
                const buttons = new MessageActionRow()
                    .addComponents(
                        [
                            new MessageButton()
                                .setCustomId('left')
                                .setLabel('◀️')
                                .setStyle('PRIMARY')
                                .setDisabled(),
                            new MessageButton()
                                .setCustomId('right')
                                .setLabel('▶️')
                                .setStyle('PRIMARY'),
                            new MessageButton()
                                .setCustomId('stop')
                                .setLabel('⏹️')
                                .setStyle('DANGER'),
                        ],
                    );

                const msg: Message = await message.reply(
                    {
                        embeds: [embeds[0]],
                        components: [buttons],
                    },
                );
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
                const filter = (i: any) => i.user.id === message.author.id;
                const collector = msg.createMessageComponentCollector({ filter: filter, componentType: 'BUTTON' });
                collector.on('collect', async i => {
                    if (i.customId === 'left') {
                        select--;
                        buttons.components[1].setDisabled(false);
                        if (select < 1) {
                            buttons.components[0].setDisabled();
                        }
                        await i.update(
                            {
                                embeds: [embeds[select]],
                                components: [buttons],
                            },
                        );
                    }
                    else if (i.customId === 'right') {
                        select++;
                        buttons.components[0].setDisabled(false);
                        if (select >= embeds.length - 1) {
                            buttons.components[1].setDisabled();
                        }
                        await i.update(
                            {
                                embeds: [embeds[select]],
                                components: [buttons],
                            },
                        );
                    }
                    else if (i.customId === 'stop') {
                        await i.update(
                            {
                                embeds: [embeds[select]],
                                components: [],
                            },
                        );
                        collector.stop();
                    }
                });
            }
            else {
                const command = client.commands.get(args[0]) || client.commands.find(c => c.aliases.includes(args[0]));
                if (!command) {
                    await message.reply(`コマンド名: ${args[0]}は存在しません`);
                    return;
                }
                await message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(`コマンド名: ${command.name}の詳細`)
                            .setDescription(`コマンド名: ${command.name}\n説明: ${command.description}\n使用法: ${codeBlock(`${process.env.PREFIX}${command.name} ${command.usage}\n`)}\nエイリアス: ${codeBlock(command.aliases.join('\n'))}\nコマンドカテゴリ: ${command.category}`)
                            .setColor('RANDOM'),
                    ],
                });
            }
        }
        catch (error) {
            commandError(client, message, error);
        }
    }
}