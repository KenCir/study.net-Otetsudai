const { Client, Message } = require("discord.js");

module.exports = {
    info: {
        name: "studytimeadd",
        description: "勉強時間追加",
        usage: "[勉強時間]",
        aliases: [""],
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
        const time = Number(args[0]);
        if (!time) return message.reply('第一引数に勉強した時間を分単位で入れてください。');
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        yield
        let userstudydata = client.db.prepare('SELECT * FROM studys WHERE user = ? AND year = ? AND month = ? AND day = ?').get(message.author.id, year, month, day);
        if (!userstudydata) {
            userstudydata = {
                id: `${message.author.id}-${year}-${month}-${day}`,
                user: message.author.id,
                year: year,
                month: month,
                day: day,
                time: 0
            }
            client.db.prepare('INSERT INTO studys (id, user, year, month, day, time) VALUES (@id, @user, @year, @month, @day, @time);').run(userstudydata);
        }
        let userstudyalldata = client.db.prepare('SELECT * FROM studyranks WHERE user = ?').get(message.author.id);
        if (!userstudyalldata) {
            userstudyalldata = {
                id: `${message.author.id}`,
                user: message.author.id,
                alltime: 0
            }
            client.db.prepare('INSERT INTO studyranks (id, user, alltime) VALUES (@id, @user, @alltime);').run(userstudyalldata);
        }
        userstudydata.time += time;
        userstudyalldata.alltime += time;
        client.db.prepare('UPDATE studys SET time = ? WHERE user = ? AND year = ? AND month = ? AND day = ?').run(userstudydata.time, userstudydata.year, userstudydata.user, userstudydata.month, userstudydata.day);
        client.db.prepare('UPDATE studyranks SET alltime = ? WHERE user = ?').run(userstudyalldata.alltime, userstudyalldata.id);
        message.channel.send(`${time}分、本日の勉強時間に加算いたしました。`);
    }
}