import { MajoCommand, MajoCommandOptions } from '../../lib/structures/MajoCommand';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, container } from '@sapphire/framework';
import type { Message } from 'discord.js';
import ModClient from '../../lib/moderation/ModClient';

@ApplyOptions<MajoCommandOptions>({
	name: 'slowmode',
	preconditions: ['ModOnly'],
	description: 'Set a slowmode for users.',
	fullCategory: ['Moderation'],
	examples: ['clear 50']
})
export default class SlowmodeCommand extends MajoCommand {
	public ModClient: ModClient;
	constructor(context: Command.Context, options: MajoCommandOptions) {
		super(context, options);
		this.ModClient = new ModClient(container.client);
	}
	override async messageRun(message: Message, args: Args) {
		const amount = await args.pick('number');

		return this.ModClient.slowmode(message, amount);
	}
}
