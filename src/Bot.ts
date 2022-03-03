/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Client, Collection, Intents } from 'discord.js';
import { readdirSync } from 'fs';
import { getLogger, configure, shutdown, Logger } from 'log4js';
import { join } from 'path';
import { Database } from './database/Database';
import { Command } from './interfaces';
configure({
  appenders: {
    out: { type: 'stdout', layout: { type: 'coloured' } },
    app: { type: 'file', filename: 'logs/studynet-otetudai.log', pattern: 'yyyy-MM-dd.log' },
  },
  categories: {
    default: { appenders: ['out', 'app'], level: 'all' },
  },
});

/**
 * Bot
 */
export class Bot extends Client {
  public readonly logger: Logger;
  public readonly commands: Collection<string, Command>;
  public readonly database: Database;

  constructor() {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
      ],
      allowedMentions: {
        parse: ['users'],
        repliedUser: false,
      },
    });

    this.logger = getLogger('Studynet-Otetudai');
    this.commands = new Collection();
    this.database = new Database();
  }

  async start(): Promise<void> {
    try {
      readdirSync(join(__dirname, '/events/process/'))
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        .forEach(async file => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const event = await import(join(__dirname, `/events/process/${file}`));
          const eventName = file.split('.')[0];
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          process.on(eventName, event.run.bind(null, this));
          this.logger.info(`Process ${eventName} event is Loading`);
        });

      readdirSync(join(__dirname, '/events/discord/'))
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        .forEach(async file => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const event = await import(join(__dirname, `/events/discord/${file}`));
          const eventName = file.split('.')[0];
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          this.on(eventName, event.run.bind(null, this));
          this.logger.info(`Discord ${eventName} event is Loading`);
        });

      const commandFolders = readdirSync(join(__dirname, '/commands'));
      for (const folder of commandFolders) {
        const commandFiles = readdirSync(join(__dirname, '/commands/', folder)).filter((file) => file.endsWith('.ts'));
        for (const file of commandFiles) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const command = await import(join(__dirname, '/commands/', folder, file));
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          const cmd: Command = new command.default();
          this.commands.set(cmd.name, cmd);
          this.logger.info(`${cmd.name} command is Loading`);
        }
      }

      await this.login();
    }
    catch (error) {
      this.logger.error(error);
      this.logger.fatal('Bot起動に失敗しました');
      process.exit(-1);
    }
  }

  stop() {
    this.destroy();
    shutdown();
  }
}
