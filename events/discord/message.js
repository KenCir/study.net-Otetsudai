const { Client, Message } = require("discord.js");
const { errorlog, clienterrorlog } = require("../../functions/error");

/**
 * @param {Client} client 
 * @param {Message} message 
 */

module.exports = async (client, message) => {
    try {
        if (message.system || !message.guild || message.author.bot) return;
        if (!message.content.startsWith(process.env.PREFIX)) return;
        const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        if (!command) return;
        const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.info.aliases && cmd.info.aliases.includes(command));
        if (!cmd) return;
        if (cmd.info.owneronly && message.author.id !== process.env.OWNERID) return message.reply('そのコマンドを使用する権限が足りてないようです。');
        cmd.run(client, message, args);
        client.cooldown.set(message.author.id, true);
    } catch (error) {
        clienterrorlog(error);
    }
}