const { Client, Message } = require("discord.js");
const QuickChart = require('quickchart-js');
const { errorlog } = require("../../functions/error");

module.exports = {
    info: {
        name: "graph",
        description: "勉強時間をグラフで表示",
        usage: "",
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
        try {
            const option = args[0];
            if (!option || option === 'days') {
                const date = new Date();
                const all = client.db.prepare("SELECT * FROM studys WHERE user = ? AND year = ? AND month = ? ORDER BY day ASC;").all(message.author.id, date.getFullYear(), date.getMonth());
                if (all.length < 1) return message.reply('あなたはまだデータがないようです。');
                const labels = [];
                const time = [];

                for (const data of all) {
                    labels.push(`${date.getMonth()}月${data.day}日`);
                    time.push(data.time)
                }

                const chart = new QuickChart();
                chart.setConfig({
                    type: 'bar',
                    data: { labels: labels, datasets: [{ label: '勉強時間', data: time }] },
                });
                const url = await chart.getShortUrl();
                message.channel.send(url);
            }

        } catch (error) {
            errorlog(message, error);
        }
        finally {
            client.cooldown.set(message.author.id, false);
        }
    }
}