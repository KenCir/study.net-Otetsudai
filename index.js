require('dotenv').config();
const fs = require("fs");
const { Client, Intents, Collection } = require('discord.js');
const SQLite = require("better-sqlite3");
const client = new Client({ fetchAllMembers: true, ws: { intents: Intents.ALL } });
client.commands = new Collection();
client.cooldown = new Collection();
client.db = new SQLite('otetudai.db');

fs.readdir(__dirname + "/events/process/", (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        const event = require(__dirname + `/events/process/${file}`);
        let eventName = file.split(".")[0];
        process.on(eventName, event.bind(null, client))
        console.log(`Process ${eventName} event is Loading`);
    });
});

fs.readdir(__dirname + "/events/discord/", (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        const event = require(__dirname + `/events/discord/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
        console.log(`Discord ${eventName} event is Loading`);
    });
});

const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.info.name, command);
        console.log(`${command.info.name} command is Loading`);
    }
}

client.login()
    .catch(error => {
        console.error(error);
        process.exit(-1);
    });