const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    info: {
        name: "ranking",
        description: "勉強時間ランキング",
        usage: "",
        aliases: ["rank"],
        owneronly: false,
        adminonly: false,
        category: 'Study'
    },

    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array} args 
     */

    run: async function (client, message, args) {
        const all = client.db.prepare("SELECT * FROM studyranks ORDER BY alltime DESC;").all();
        if (all.length < 1) return message.reply('まだデータがないようです。');
        let embeds = [];
        let ranknumber1 = 1;
        let ranknumber2 = 10;
        let rank = 1;

        for (let i = 0; i < Math.ceil(all.length / 10); i++) {
            embeds.push(
                new MessageEmbed()
                    .setTitle(`勉強時間ランキング${ranknumber1}〜${ranknumber2}位`)
                    .setColor('RANDOM')
                    .setTimestamp()
            );
            ranknumber1 += 10;
            ranknumber2 += 10;
        }

        for (const data of all) {
            const user = message.guild.member(data.user);
            let usertag = ''
            if (!user) {
                usertag = '取得不可User';
            }
            else {
                usertag = user.user.tag;
            }
            embeds[Math.ceil(rank / 10) - 1].addField(`${rank}位: ${usertag}`, `${data.alltime}分`);
            rank++;
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
            else if (response.content === '0') {
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
}