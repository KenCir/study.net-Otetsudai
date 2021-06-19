const { Client, Message, MessageEmbed } = require('discord.js');
const { errorlog } = require('../../functions/error');

module.exports = {
    info: {
        name: "ping",
        description: "BotのPing値とメモリ使用率を表示",
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
            const used = process.memoryUsage();
            let memory = 0;
            memory = Math.round(used.rss / 1024 / 1024 * 100) / 100;
            memory += Math.round(used.heapUsed / 1024 / 1024 * 100) / 100;
            memory += Math.round(used.heapTotal / 1024 / 1024 * 100) / 100;
            message.channel.send('Pong!')
                .then(msg => msg.edit('',
                    new MessageEmbed()
                        .setDescription(`APIPing: ${msg.createdTimestamp - message.createdTimestamp}ms\nWebSocketPing: ${client.ws.ping}ms\nメモリ使用率: ${memory}MB`)
                        .setColor('RANDOM')
                        .setTimestamp()
                ));
        } catch (error) {
            errorlog(message, error);
        }
        finally {
            client.cooldown.set(message.author.id, false);
        }
    },
};