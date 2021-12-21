import { config } from 'dotenv';
import { Bot } from './Bot';
config();
function main() {
    const client: Bot = new Bot();
    client.start();
}

main();