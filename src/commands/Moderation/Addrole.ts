import { MajoCommand, MajoCommandOptions } from '../../lib/structures/MajoCommand';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, container } from '@sapphire/framework';
import type { Message } from 'discord.js';
import ModClient from '../../lib/moderation/ModClient';

@ApplyOptions<MajoCommandOptions>({
	name: 'addrole',
	aliases: ['ar'],
	preconditions: ['ModOnly'],
	description: 'Add a role to a user',
	fullCategory: ['Moderation'],
	examples: ['addrole @funny @tovade']
})
export default class AddroleCommand extends MajoCommand {
	public ModClient: ModClient;
	constructor(context: Command.Context, options: MajoCommandOptions) {
		super(context, options);
		this.ModClient = new ModClient(container.client);
	}
	override async messageRun(message: Message, args: Args) {
		const role = await args.pick('role');
		const member = await args.pick('member');

		return this.ModClient.addrole(message, role, member);
	}
}
