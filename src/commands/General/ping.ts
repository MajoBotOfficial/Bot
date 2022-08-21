import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import { MajoCommand, MajoCommandOptions } from '../../lib/structures/MajoCommand';
import { sendLocalized } from '@sapphire/plugin-i18next';
import type { ChatInputCommand } from '@sapphire/framework';
import { replyLocalized } from '../../lib/utils';

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
	public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
		const msg = (await replyLocalized(interaction, {
			keys: 'commands:ping:ping'
		})) as Message;

		return replyLocalized(interaction, {
			keys: 'commands:ping:pong',
			formatOptions: {
				bot_latency: `${Math.round(this.container.client.ws.ping)}`,
				api_latency: `${(msg.editedTimestamp || msg.createdTimestamp) - interaction.createdTimestamp}`
			}
		});
	}
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description));
	}
}
