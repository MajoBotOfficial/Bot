import { MajoCommand, MajoCommandOptions } from '../../lib/structures/MajoCommand';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, container } from '@sapphire/framework';
import type { Message } from 'discord.js';
import ModClient from '../../lib/moderation/ModClient';

@ApplyOptions<MajoCommandOptions>({
	name: 'removerole',
	aliases: ['rr'],
	preconditions: ['ModOnly'],
	description: 'Remove a role from an user',
	fullCategory: ['Moderation'],
	examples: ['removerole @funny @tovade']
})
export default class RemoveRoleCommand extends MajoCommand {
	public ModClient: ModClient;
	constructor(context: Command.Context, options: MajoCommandOptions) {
		super(context, options);
		this.ModClient = new ModClient(container.client);
	}
	override async messageRun(message: Message, args: Args) {
		const role = await args.pick('role');
		const member = await args.pick('member');

		return this.ModClient.removerole(message, role, member);
	}
}
