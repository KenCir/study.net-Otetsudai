import { Bot } from '../../Bot';

export function run(client: Bot, code: number): void {
    client.logger.info(`${client.user?.tag}はコード${code}で終了しました`);
    client.stop();
}