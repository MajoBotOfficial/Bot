import { MajoCommand, MajoCommandOptions } from '../../lib/structures/MajoCommand';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, container } from '@sapphire/framework';
import type { Message } from 'discord.js';
import ModClient from '../../lib/moderation/ModClient';

@ApplyOptions<MajoCommandOptions>({
	name: 'kick',
	preconditions: ['ModOnly'],
	description: 'Kick a user',
	fullCategory: ['Moderation'],
	examples: ['kick @tovade']
})
export default class KickCommand extends MajoCommand {
	public ModClient: ModClient;
	constructor(context: Command.Context, options: MajoCommandOptions) {
		super(context, options);
		this.ModClient = new ModClient(container.client);
	}
	override async messageRun(message: Message, args: Args) {
		const amount = await args.pick('member');
		const reason = await args.pick('string').catch(() => {});

		return this.ModClient.kick(message, amount, reason as string);
	}
}
