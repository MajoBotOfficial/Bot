import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import { Args } from '@sapphire/framework';
import settings from '../../../settings.json';

@ApplyOptions<SubCommandPluginCommandOptions>({
	name: 'prefix',
	description: 'View prefix or set one',
	fullCategory: ['Settings'],
	requiredUserPermissions: ['ADMINISTRATOR'],
	subCommands: ['set', 'reset', { input: 'show', default: true }]
})
export class UserCommand extends SubCommandPluginCommand {
	public async show(message: Message) {
		const guild = await this.container.client.databases.guilds.get(message.guildId as string);

		return message.channel.send({
			embeds: [
				{
					color: 'GREEN',
					description: `**The prefix of this guild is \`${guild.prefix}\`**`,
					fields: [
						{
							name: 'How can i set a prefix?',
							value: `${guild.prefix}prefix set [prefix]`
						}
					],
					timestamp: new Date(),
					footer: { text: '©️ Copyright Majobot' }
				}
			]
		});
	}
	public async set(message: Message, args: Args) {
		const userPrefix = await args.rest('string');
		this.container.client.databases.guilds.set(message.guildId as string, 'prefix', userPrefix[0]);
		return message.channel.send({
			embeds: [
				{
					color: 'GREEN',
					description: `**The prefix of this guild has been updated to \`${userPrefix[0]}\`**`,
					timestamp: new Date(),
					footer: { text: '©️ Copyright Majobot' }
				}
			]
		});
	}
	public async reset(message: Message) {
		this.container.client.databases.guilds.set(message.guildId as string, 'prefix', settings.prefix);
		return message.channel.send({
			embeds: [
				{
					color: 'GREEN',
					description: `**The prefix of this guild has been updated to \`${settings.prefix}\`**`,
					timestamp: new Date(),
					footer: { text: '©️ Copyright Majobot' }
				}
			]
		});
	}
}
