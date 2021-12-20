import { Bot } from '../../Bot';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export function run(client: Bot, reason: Error, promise: Promise<any>): void {
    client.logger.error(reason);
}