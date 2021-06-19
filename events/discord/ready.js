const { Client } = require('discord.js');
const { clienterrorlog } = require('../../functions/error');

/**
 * @param {Client} client
 */

module.exports = async (client) => {
    try {
        const Studytable = client.db.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'studys';").get();
        if (!Studytable['count(*)']) {
            client.db.prepare("CREATE TABLE studys (id TEXT PRIMARY KEY, user TEXT, year INTEGER, month INTEGER, day INTEGER, time INTEGER);").run();
            client.db.prepare("CREATE UNIQUE INDEX idx_studys_id ON studys (id);").run();
            client.db.pragma("synchronous = 1");
            client.db.pragma("journal_mode = wal");
        }

        const Studyranktable = client.db.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'studyranks';").get();
        if (!Studyranktable['count(*)']) {
            client.db.prepare("CREATE TABLE studyranks (id TEXT PRIMARY KEY, user TEXT, alltime INTEGER);").run();
            client.db.prepare("CREATE UNIQUE INDEX idx_studyranks_id ON studyranks (id);").run();
            client.db.pragma("synchronous = 1");
            client.db.pragma("journal_mode = wal");
        }

        const Todolisttable = client.db.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'todolists';").get();
        if (!Todolisttable['count(*)']) {
            client.db.prepare("CREATE TABLE todolists (id TEXT PRIMARY KEY, user TEXT, title TEXT, description TEXT);").run();
            client.db.prepare("CREATE UNIQUE INDEX idx_todolists_id ON todolists (id);").run();
            client.db.pragma("synchronous = 1");
            client.db.pragma("journal_mode = wal");
        }

        const PersonalChanneltable = client.db.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'personalchannels';").get();
        if (!PersonalChanneltable['count(*)']) {
            client.db.prepare("CREATE TABLE personalchannels (id TEXT PRIMARY KEY, user TEXT channel TEXT);").run();
            client.db.prepare("CREATE UNIQUE INDEX idx_personalchannels_id ON personalchannels (id);").run();
            client.db.pragma("synchronous = 1");
            client.db.pragma("journal_mode = wal");
        }

        client.user.setPresence({ activity: { name: '?help', type: 'PLAYING' }, status: 'online' });
        console.log(`Logged in as ${client.user.tag}`);
    } catch (error) {
        clienterrorlog(error);
    }
}
