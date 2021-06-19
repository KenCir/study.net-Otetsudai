const { Client } = require('discord.js');
const { clienterrorlog } = require('./functions/error');

module.exports = {

    /**
     * @param {Client} client
     */

    run: async function (client) {
        try {
            const handleReaction = async (channelID, messageID, callback) => {
                const channel = await client.channels.fetch(channelID);
                const message = await channel.messages.fetch(messageID);
                const collector = message.createReactionCollector(() => true);
                collector.on('collect', (reaction, user) => callback(reaction, user));
            }

            handleReaction('838374676425867274', '838374886866944030', async (reaction, user) => {
                if (user.bot) return;
                if (reaction.emoji.name === '📚') {
                    let userdata = client.db.prepare('SELECT * FROM personalchannels WHERE user = ?').get(user.id);
                    if (!userdata) {
                        client.guilds.cache.get('831167683818553447').channels.create(`${ticketdata.ticketid}-`,
                            {
                                type: 'text',
                                parent: '838374622776918048',
                                topic: `<@${user.id}>さん専用チャンネル`,
                                permissionOverwrites: [
                                    {
                                        id: '831167683818553447',
                                        deny: ['VIEW_CHANNEL']
                                    },
                                    {
                                        id: user.id,
                                        allow: ['VIEW_CHANNEL']
                                    }
                                ]
                            })
                            .then(channel => {
                                channel.send(`${user}さん専用チャンネルを作成しいたしました。`);
                                userdata = { id: `${user.id}-${channel.id}`, user: user.id, channel: channel.id };
                                client.db.prepare('INSERT INTO personalchannels (id, user, channel) VALUES (@id, @user, @channel)').run(userdata);
                            });
                    }
                    else {
                        const reply = await client.channels.cache.get('838374676425867274').send(`${user} あなたの個人チャンネルは既に作成済みでございます\n${user}さんの個人チャンネル: <#${userdata.channel}>`);
                        reply.delete({ timeout: 5000 });
                    }
                }
            })
        } catch (error) {
            clienterrorlog(error);
        }

    }
}