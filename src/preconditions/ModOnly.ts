import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';
import type { CommandInteraction } from 'discord.js';
import type { ContextMenuInteraction } from 'discord.js';
import { GuildMember, Permissions } from 'discord.js';

export class UserPrecondition extends Precondition {
	public override async messageRun(message: Message) {
		// for message command
		return this.checkPerms(message.member as GuildMember);
	}
	public override async chatInputRun(interaction: CommandInteraction) {
		// for slash command
		return this.checkPerms(interaction.member as GuildMember);
	}
	public override async contextMenuRun(interaction: ContextMenuInteraction) {
		// for context menu command
		return this.checkPerms(interaction.member as GuildMember);
	}
	private async checkPerms(member: GuildMember) {
		if (member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return this.ok();
		else return this.error({ message: 'Missing permissions!' });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		ModOnly: never;
	}
}
