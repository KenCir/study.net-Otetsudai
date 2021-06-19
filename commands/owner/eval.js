const { Client, Message } = require('discord.js');
const { inspect } = require('util');
const { errorlog } = require('../../functions/error');

module.exports = {
    info: {
        name: "eval",
        description: "jsのコードを実行する",
        usage: "",
        aliases: [""],
        owneronly: true,
        adminonly: false,
        category: 'Owner'
    },

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {Array} args
     */

    run: async function (client, message, args) {
        try {
            const msg = await message.channel.send('```以下のコードを実行してもいいですか？\n実行していい場合はokを、キャンセルする場合はnoを送信してください\n30秒経つと強制キャンセルされます```\n```js\n' + args.join(' ') + '\n```');
            while (true) {
                const filter = msg => msg.author.id === message.author.id;
                const collected = await message.channel.awaitMessages(filter, { max: 1, time: 30000 });
                const response = collected.first();
                if (!response) {
                    msg.delete();
                    break;
                }
                if (response.content === 'ok') {
                    response.delete();
                    let evaled;
                    try {
                        evaled = await eval(args.join(' '));
                        const evalinsoext = inspect(evaled).length;
                        message.react('✅');
                        if (evalinsoext <= 2000) {
                            msg.edit(inspect(evaled), { code: true });
                        }
                    }
                    catch (error) {
                        message.react('❌');
                        msg.edit(error, { code: true });
                    }
                    break;
                }
                else if (response.content === 'no') {
                    response.delete();
                    msg.delete();
                    break;
                }
            }
        } catch (error) {
            errorlog(message, error);
        }
        finally {
            client.cooldown.set(message.author.id, false);
        }
    },
};