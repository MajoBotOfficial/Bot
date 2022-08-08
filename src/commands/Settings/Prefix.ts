import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import { Args } from '@sapphire/framework';
import settings from '../../../settings.json';
import { MajoSubCommand, MajoSubCommandOptions } from '../../lib/structures/MajoCommand';
import { resolveKey } from '@sapphire/plugin-i18next';

@ApplyOptions<MajoSubCommandOptions>({
	name: 'prefix',
	description: 'View prefix or set one',
	fullCategory: ['Settings'],
	requiredUserPermissions: ['ADMINISTRATOR'],
	subCommands: ['set', 'reset', { input: 'show', default: true }],
	examples: ['prefix set !', 'prefix reset']
})
export class PrefixCommand extends MajoSubCommand {
	public async show(message: Message) {
		const guild = await this.container.client.databases.guilds.get(message.guildId as string);

		return message.channel.send({
			embeds: [
				{
					color: 'GREEN',
					description: (await resolveKey(message, 'commands:prefix:show', {
						formatOptions: {
							prefix: guild.prefix
						}
					})) as string,
					fields: [
						{
							name: await resolveKey(message, 'commands:prefix:tips:set_name'),
							value: await resolveKey(message, 'commands:prefix:tips:set_value', {
								formatOptions: {
									prefix: guild.prefix
								}
							})
						}
					],
					timestamp: new Date(),
					footer: { text: '©️ Majobot' }
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
					description: (await resolveKey(message, 'commands:prefix:updated', {
						formatOptions: { prefix: userPrefix[0] }
					})) as string,
					timestamp: new Date(),
					footer: { text: '©️ Majobot' }
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
					description: (await resolveKey(message, 'commands:prefix:reset', {
						formatOptions: {
							prefix: settings.prefix
						}
					})) as string,
					timestamp: new Date(),
					footer: { text: '©️ Majobot' }
				}
			]
		});
	}
}
