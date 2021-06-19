const { Client, Message, MessageEmbed } = require("discord.js");
const { errorlog } = require("../../functions/error");

module.exports = {
    info: {
        name: "todo",
        description: "to do list",
        usage: "",
        aliases: [""],
        owneronly: false,
        adminonly: false,
        category: 'Main'
    },

    /**
     * @param {Client} client 
     * @param {Message} message
     * @param {Array} args
     */

    run: async function (client, message, args) {
        try {
            if (args[0] === 'add') {
                const msg = await message.channel.send('Todoに追加する名前を送信してください');
                const filter = msg => msg.author.id === message.author.id;
                const collected = await message.channel.awaitMessages(filter, { max: 1, time: 30000 });
                const response = collected.first();
                if (!response) return msg.edit('時間切れです...');
                const title = response.content;
                response.delete();
                msg.edit('追加するTodoの説明を送信してください');
                const filter2 = msg => msg.author.id === message.author.id;
                const collected2 = await message.channel.awaitMessages(filter2, { max: 1, time: 30000 });
                const response2 = collected2.first();
                if (!response2) return msg.edit('時間切れです...');
                const description = response2.content;
                response2.delete();

                const todo = client.db.prepare('SELECT * FROM todolists WHERE user = ? AND title = ?').get(message.author.id, title);
                if (todo) return message.reply('その名前のTodoは既に登録済みのようです。');
                const data = {
                    id: `${message.author.id}-${title}`,
                    user: message.author.id,
                    title: title,
                    description: description
                };
                client.db.prepare('INSERT INTO todolists (id, user, title, description) VALUES (@id, @user, @title, @description);').run(data);
                msg.edit('',
                    new MessageEmbed()
                        .setTitle('Todoうんこ登録完了')
                        .setDescription('以下の内容で登録しました')
                        .addField('Todo名', title)
                        .addField('説明', description)
                        .setColor('RANDOM')
                        .setTimestamp()
                );
            }
            else if (args[0] === 'list') {
                const all = client.db.prepare("SELECT * FROM todolists WHERE user = ? ORDER BY user DESC;").all(message.author.id);
                if (all.length === 0) return message.reply('あなたはTodoに何も登録してないようです。');
                let embeds = [];
                let count = 1;

                for (let i = 0; i < Math.ceil(all.length / 10); i++) {
                    embeds.push(
                        new MessageEmbed()
                            .setTitle(`${message.author.tag} TodoList ${i + 1}ページ目`)
                            .setColor('RANDOM')
                            .setTimestamp()
                    );
                }

                for (const data of all) {
                    embeds[Math.ceil(count / 10) - 1].addField(`No. ${count}: ${data.title} `, data.description);
                    count++;
                }

                const msg = await message.channel.send('```' + `1/${embeds.length}ページ目を表示中\nみたいページ番号を発言してください\n0を送信するか30秒経つと処理が止まります` + '```', embeds[0]);
                while (true) {
                    const filter = msg => msg.author.id === message.author.id;
                    const collected = await message.channel.awaitMessages(filter, { max: 1, time: 30000 });
                    const response = collected.first();
                    if (!response) {
                        msg.edit('');
                        break;
                    }
                    if (response.content === '0') {
                        response.delete();
                        msg.edit('');
                        break;
                    }
                    else {
                        const selectembed = Number(response.content);
                        if (selectembed > 0 && selectembed < embeds.length + 1) {
                            response.delete();
                            msg.edit('```' + `${selectembed}/${embeds.length}ページ目を表示中\nみたいページ番号を発言してください\n0を送信するか30秒経つと処理が止まります` + '```', embeds[selectembed - 1]);
                        }
                    }
                }
            }
            else if (args[0] === 'remove') {
                const all = client.db.prepare("SELECT * FROM todolists WHERE user = ? ORDER BY user DESC;").all(message.author.id);
                if (all.length === 0) return message.reply('あなたはTodoに何も登録してないようです。');
                let embeds = [];
                let count = 1;

                for (let i = 0; i < Math.ceil(all.length / 10); i++) {
                    embeds.push(
                        new MessageEmbed()
                            .setTitle(`${message.author.tag} TodoList ${i + 1}ページ目`)
                            .setColor('RANDOM')
                            .setTimestamp()
                    );
                }

                for (const data of all) {
                    embeds[Math.ceil(count / 10) - 1].addField(`No. ${count}: ${data.title} `, data.description);
                    count++;
                }

                const msg = await message.channel.send('```' + `1/${embeds.length}ページ目を表示中\n削除したい番号を発言してください\n0を送信するか30秒経つと処理が止まります` + '```', embeds[0]);
                while (true) {
                    const filter = msg => msg.author.id === message.author.id;
                    const collected = await message.channel.awaitMessages(filter, { max: 1, time: 30000 });
                    const response = collected.first();
                    if (!response) {
                        msg.edit('');
                        return;
                    }
                    if (response.content === '0') {
                        response.delete();
                        msg.edit('');
                        return;
                    }
                    else {
                        var selecttodo = Number(response.content);
                        if (selecttodo > all.length || !selecttodo) continue;
                        response.delete();
                        break;
                    }
                }

                msg.edit(`以下のTodoを削除してよろしいですか？\n消す場合はokを、消さない場合はnoを送信してください。`,
                    new MessageEmbed()
                        .setTitle('Todo削除最終確認')
                        .addField('Todo名', all[selecttodo - 1].title)
                        .addField('Todoの説明', all[selecttodo - 1].description)
                        .setColor('RANDOM')
                        .setTimestamp()
                );
                while (true) {
                    const filter = msg => msg.author.id === message.author.id;
                    const collected = await message.channel.awaitMessages(filter, { max: 1, time: 30000 });
                    const response = collected.first();
                    if (!response) {
                        msg.edit('');
                        break;
                    }
                    if (response.content === 'no') {
                        response.delete();
                        msg.edit('');
                        break;
                    }
                    else if (response.content === 'ok') {
                        response.delete();
                        client.db.prepare('DELETE FROM todolists WHERE id = ?').run(all[selecttodo - 1].id);
                        msg.edit('削除しました');
                        break;
                    }
                }
            }
            else if (args[0] === 'info') {
                if (!args[1]) {
                    message.react('816282137065947136');
                    return message.reply('第二引数にTodoの名前を入力してください！');
                }

                const todo = client.db.prepare('SELECT * FROM todolists WHERE user = ? AND title = ?').get(message.author.id, args[1]);
                if (!todo) {
                    message.react('816282137065947136');
                    return message.reply('その名前のTodoは存在しないようです。');
                }

                message.channel.send(
                    new MessageEmbed()
                        .setTitle(`識別番号${todo.title}の詳細`)
                        .addField('Todo名', todo.title)
                        .addField('Todoの説明', todo.description)
                        .setColor('RANDOM')
                        .setTimestamp()
                );
            }
            else if (args[0] === 'allremove') {
                const msg = await message.channel.send(`本当に全てのTodoを削除してよろしいですか？\n消す場合は1を、消さない場合は0を送信してください。`)
                while (true) {
                    const filter = msg => msg.author.id === message.author.id;
                    const collected = await message.channel.awaitMessages(filter, { max: 1, time: 30000 });
                    const response = collected.first();
                    if (!response) {
                        msg.edit('');
                        break;
                    }
                    if (response.content === '0') {
                        response.delete();
                        msg.edit('');
                        break;
                    }
                    else if (response.content === '1') {
                        response.delete();
                        client.db.prepare('DELETE FROM todolists WHERE user = ?').run(message.author.id);
                        msg.edit('削除しました');
                        break;
                    }
                }
            }
            else {
                message.channel.send(
                    new MessageEmbed()
                        .setTitle('To do うんこ')
                        .setDescription(`\`${process.env.PREFIX}todo add\` TodoListに追加する\n\`${process.env.PREFIX}todo list\` TodoのList\n\`${process.env.PREFIX}todo remove\` TodoListから削除する\n\`${process.env.PREFIX}todo info [識別番号]\` Todoの詳細\n\`${process.env.PREFIX}todo allremove\` Todoから全て削除`)
                        .setColor('RANDOM')
                        .setTimestamp()
                );
            }
        } catch (error) {
            errorlog(message, error);
        }
        finally {
            client.cooldown.set(message.author.id, false);
        }
    }
}