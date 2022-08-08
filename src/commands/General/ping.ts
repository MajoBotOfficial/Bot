import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import { MajoCommand, MajoCommandOptions } from '../../lib/structures/MajoCommand';
import { sendLocalized } from '@sapphire/plugin-i18next';

@ApplyOptions<MajoCommandOptions>({
	name: 'ping',
	description: 'ping pong',
	fullCategory: ['General']
})
export class UserCommand extends MajoCommand {
	public override async messageRun(message: Message) {
		const msg = await sendLocalized(message, 'commands:ping:ping');

		msg.delete();
		return sendLocalized(message, {
			keys: 'commands:ping:pong',
			formatOptions: {
				bot_latency: `${Math.round(this.container.client.ws.ping)}`,
				api_latency: `${(msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)}`
			}
		});
	}
}
