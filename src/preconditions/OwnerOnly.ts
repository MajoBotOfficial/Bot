import {Precondition} from '@sapphire/framework';
import type { Message } from 'discord.js';
import type {CommandInteraction} from "discord.js";
import type {ContextMenuInteraction} from "discord.js";
import settings from '../../settings.json'

export class UserPrecondition extends Precondition {
	public override async messageRun(message: Message) {
		// for message command
		return this.checkOwner(message.author.id);
	}
	public override async chatInputRun(interaction: CommandInteraction) {
		// for slash command
		return this.checkOwner(interaction.user.id);
	}
	public override async contextMenuRun(interaction: ContextMenuInteraction) {
		// for context menu command
		return this.checkOwner(interaction.user.id);
	}
	private async checkOwner(userId: string) {
		return settings.owners.includes(userId)
			? this.ok()
			: this.error({ message: 'Only the bot owner can use this command!' });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		OwnerOnly: never;
	}
}
