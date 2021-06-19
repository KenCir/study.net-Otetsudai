const { Client } = require('discord.js');

/**
 * @param {Client} client
 */

module.exports = (client, reason, promise) => {
    console.error(reason);
    try {
        client.channels.cache.get('835407049893478430').send(reason.stack, { code: true, split: true });
    } catch (error) { }
};