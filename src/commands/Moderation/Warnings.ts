import { MajoSubCommand, MajoSubCommandOptions } from '../../lib/structures/MajoCommand';
import type { Subcommand } from '@sapphire/plugin-subcommands';
import { WarnClient } from '../../lib/moderation/ModClient';
import { Args, container } from '@sapphire/framework';
import { ColorResolvable, GuildMember, Message, MessageEmbed, Snowflake } from 'discord.js';

export default class WarningsSubCommand extends MajoSubCommand {
	public warnClient: WarnClient;
	constructor(context: Subcommand.Context, options: MajoSubCommandOptions) {
		super(context, {
			...options,
			name: 'warnings',
			description: 'Check or add warnings to an user',
			preconditions: ['ModOnly'],
			fullCategory: ['Moderation'],
			examples: ['warnings @tovade', 'warnings add @tovade you bully', 'warnings remove @tovade 1', 'warnings reset @tovade'],
			subcommands: [
				{
					name: 'show',
					default: true,
					messageRun: 'messageShow'
				},
				{
					name: 'add',
					messageRun: 'messageAdd'
				},
				{
					name: 'reset',
					messageRun: 'messageReset'
				},
				{ name: 'remove', messageRun: 'messageRemove' }
			]
		});
		this.warnClient = new WarnClient(container.client);
	}
	public async messageShow(message: Message, args: Args) {
		const member = await args.pick('member').catch(() => message.member);
		const warnings = await this.warnClient.get(message.guildId as Snowflake, member?.id as Snowflake);
		let embed;
		if (warnings) {
			embed = new MessageEmbed()
				.setColor(container.client.config.bot.color as ColorResolvable)
				.setTitle('Warnings')
				.setDescription(
					`${warnings.content
						.map((w: any, i: any) => `**ID:** ${i}\n**Moderator:** ${w.moderatorTAG}\n**Date:** ${w.date}\n**Reason:** ${w.reason}\n`)
						.join(' ')}`
				)
				.setFooter({ text: '©️ Majobot' });
		} else if (!warnings || !warnings.length) {
			embed = new MessageEmbed()
				.setColor(container.client.config.bot.color as ColorResolvable)
				.setTitle('Warnings')
				.setDescription('This user has no warnings.')
				.setFooter({ text: '©️ Majobot' });
		}
		return message.channel.send({
			embeds: [embed as MessageEmbed]
		});
	}
	public async messageAdd(message: Message, args: Args) {
		const member = await args.pick('member');
		let reason = await args.pick('string').catch(() => {});
		if (!reason) reason = 'Not provided';
		await this.warnClient.add(
			message.guildId as Snowflake,
			member.id as Snowflake,
			{
				reason
			},
			message.member as GuildMember
		);
		const embed = new MessageEmbed()
			.setColor(container.client.config.bot.color as ColorResolvable)
			.setAuthor({
				name: member.displayName
			})
			.setDescription(`Warned ${member?.displayName}\nReason: ${reason}\n Moderator: ${message.member?.displayName} ||${message.member?.id}||`)
			.setTitle('Warning')
			.setFooter({ text: '© Majobot' });
		return message.channel.send({
			embeds: [embed]
		});
	}
	public async messageReset(message: Message, args: Args) {
		const member = await args.pick('member');
		await this.warnClient.clear(message.guildId as Snowflake, member.id);
		const embed = new MessageEmbed()
			.setColor(container.client.config.bot.color as ColorResolvable)
			.setAuthor({ name: message.member?.displayName as string })
			.setDescription(`Cleared all warnings for \`${member?.displayName}\``)
			.setTitle('Warning')
			.setFooter({ text: '© Majobot' });
		return message.channel.send({
			embeds: [embed]
		});
	}
	public async messageRemove(message: Message, args: Args) {
		const member = await args.pick('member');
		const warnID = await args.pick('string');
		const data = await this.warnClient.remove(message.guildId as Snowflake, member?.id as Snowflake, warnID);
		let embed;
		if (data) {
			embed = new MessageEmbed()
				.setColor(container.client.config.bot.color as ColorResolvable)
				.setAuthor({ name: message.member?.displayName as string })
				.setDescription('Successfully removed a warning with the ID: ' + warnID)
				.setTitle('Warning')
				.setFooter({ text: '© Majobot' });
		} else {
			embed = new MessageEmbed()
				.setColor(container.client.config.bot.color as ColorResolvable)
				.setAuthor({ name: message.member?.displayName as string })
				.setDescription('This user has no warnings or you provided the wrong warn ID')
				.setTitle('Warning')
				.setFooter({ text: '© Majobot' });
		}
		return message.channel.send({
			embeds: [embed]
		});
	}
}
