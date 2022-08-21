import { MajoCommand, MajoCommandOptions } from '../../lib/structures/MajoCommand';
import { ApplyOptions } from '@sapphire/decorators';
import { Command, container } from '@sapphire/framework';
import type { Message, TextChannel } from 'discord.js';
import ModClient from '../../lib/moderation/ModClient';

@ApplyOptions<MajoCommandOptions>({
	name: 'nuke',
	preconditions: ['ModOnly'],
	description: 'Nuke channels.',
	fullCategory: ['Moderation'],
	examples: ['nuke']
})
export default class NukeCommand extends MajoCommand {
	public ModClient: ModClient;
	constructor(context: Command.Context, options: MajoCommandOptions) {
		super(context, options);
		this.ModClient = new ModClient(container.client);
	}
	override messageRun(message: Message) {
		return this.ModClient.nuke(message, message.channel as TextChannel);
	}
}
