const { Message, WebhookClient } = require("discord.js");

module.exports = {

    /**
     * @param {Message} message 
     * @param {*} error
     */

    errorlog: async function (message, error) {
        console.error(error);
        try {
            const webhook = new WebhookClient('838350153902850108', 'E8WUmAhDR2zWvIspubUNQ1wOhnRbIP4bN8ze6fgExVnWNuEhkSLV0gQG4n-E0gZ7Lk_m');
            webhook.send(error.stack, { code: true, split: true });
            message.channel.send('コマンド実行中にエラーが発生したみたいです、もう一度実行してください。');
        }
        catch (error) { }
    },

    /**
     * @param {Client} client
     * @param {string} channelid
     * @param {*} error
     */

    clienterrorlog: async function (error) {
        console.error(error);
        try {
            const webhook = new WebhookClient('838349806594293772', 'XlWxBAuM__pq9wurJpCqtwA91wtGMDzzjoGFu_qpPpyHrhKnWJr04Xoo_cacrW4SPbDH');
            webhook.send(error.stack, { code: true, split: true });
        }
        catch (error) { }
    }
}