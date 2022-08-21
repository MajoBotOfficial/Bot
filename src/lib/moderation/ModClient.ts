import {
	ColorResolvable,
	CommandInteraction,
	GuildMember,
	Message,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	Role,
	Snowflake,
	TextChannel
} from 'discord.js';

import { bold } from '@discordjs/builders';

import { Warnings } from '../database/Entities/Warnings';
import type { SapphireClient } from '@sapphire/framework';

export default class ModClient {
	public client: SapphireClient;
	constructor(client: SapphireClient) {
		this.client = client;
	}
	ban(context: Message | CommandInteraction, member: GuildMember, reason?: string) {
		if (!member.bannable) {
			context.reply({
				content: 'I can not ban this member!'
			});
		}
		if (member.user.bot) {
			context.guild?.members.ban(member, { days: 7, reason: reason || `banned by ${context.member?.user.username} ` });
		} else {
			try {
				member.send({
					content: `${bold(`Hello! You have been banned from ${context.guild?.name} for "${reason || 'No reason provided'}"`)}`
				});
				context.guild?.members.ban(member, { days: 7, reason: reason || `banned by ${context.member?.user.username} ` });
			} catch {
				context.guild?.members.ban(member, { days: 7, reason: reason || `banned by ${context.member?.user.username} ` });
			}
		}
		const embed = new MessageEmbed()
			.setTitle('✅ Success!')
			.setDescription(`Banned ${member.user.tag} from this server!`)
			.setColor(this.client.config.bot.color as ColorResolvable)
			.setFooter({
				text: '©️ MajoBot'
			});
		context.reply({
			embeds: [embed]
		});
	}
	kick(context: Message | CommandInteraction, member: GuildMember, reason?: string) {
		if (!member.bannable) {
			context.reply({
				content: 'I can not ban this member!'
			});
		}

		member.kick(reason || `Kicked by ${context.member?.user.username} `);
		const embed = new MessageEmbed()
			.setTitle('✅ Success!')
			.setDescription(`Kicked ${member.user.tag} from this server!`)
			.setColor(this.client.config.bot.color as ColorResolvable)
			.setFooter({
				text: '©️ MajoBot'
			});
		context.reply({
			embeds: [embed]
		});
	}
	async unban(context: Message | CommandInteraction, id: string, reason: string) {
		if (typeof id !== 'string')
			return context.reply({
				content: 'You did not provide an id!'
			});
		const banlist = await context.guild?.bans.fetch();
		if (!banlist)
			return context.reply({
				content: "There are no banned members, therefore you can't unban another member!"
			});
		const bannedUser = banlist.get(id);
		if (!bannedUser)
			return context.reply({
				content: 'There is no user banned with the provided id.'
			});
		const user = await context.guild?.members.unban(id, reason);
		const embed = new MessageEmbed()
			.setTitle('✅ Success!')
			.setDescription(`Unbanned ${user?.tag} from this server!`)
			.setColor(this.client.config.bot.color as ColorResolvable)
			.setFooter({
				text: '©️ MajoBot'
			});

		context.reply({
			embeds: [embed]
		});
	}
	async addrole(context: Message | CommandInteraction, role: Role, member: GuildMember) {
		if (context.guild?.me?.roles?.highest.comparePositionTo(role)! <= 0) {
			return context.reply({ content: "The role is higher then my role, therefore i can't add the role to that user. " });
		}
		if (member.roles.cache.has(role.id)) return context.reply({ content: 'The user already has that role!' });

		member.roles.add(role);
		const embed = new MessageEmbed()
			.setTitle('✅ Success!')
			.setDescription(`Added ${role.name} to ${member.user.tag}`)
			.setColor(this.client.config.bot.color as ColorResolvable)
			.setFooter({
				text: '©️ MajoBot'
			});
		context.reply({
			embeds: [embed]
		});
	}
	async removerole(context: Message | CommandInteraction, role: Role, member: GuildMember) {
		if (context.guild?.me?.roles?.highest.comparePositionTo(role)! <= 0) {
			return context.reply({ content: "The role is higher then my role, therefore i can't remove the role to that user. " });
		}
		if (!member.roles.cache.has(role.id)) return context.reply({ content: 'The user does not have that role!' });

		member.roles.remove(role);
		const embed = new MessageEmbed()
			.setTitle('✅ Success!')
			.setDescription(`Removed ${role.name} from ${member.user.tag}`)
			.setColor(this.client.config.bot.color as ColorResolvable)
			.setFooter({
				text: '©️ MajoBot'
			});
		await context.reply({
			embeds: [embed]
		});
	}
	lock(context: Message | CommandInteraction, channel: TextChannel, reason?: string) {
		channel.permissionOverwrites.edit(context.guild?.id as string, {
			SEND_MESSAGES: false
		});
		const embed = new MessageEmbed()
			.setTitle('✅ Success!')
			.setDescription(`Locked ${channel.name} for ${reason || 'No reason provided'}`)
			.setColor(this.client.config.bot.color as ColorResolvable)
			.setFooter({
				text: '©️ MajoBot'
			});
		context.reply({
			embeds: [embed]
		});
	}
	unlock(context: Message | CommandInteraction, channel: TextChannel, reason?: string) {
		channel.permissionOverwrites.edit(context.guild?.id as string, {
			SEND_MESSAGES: true
		});
		const embed = new MessageEmbed()
			.setTitle('✅ Success!')
			.setDescription(`Unlocked ${channel.name} for ${reason || 'No reason provided'}`)
			.setColor(this.client.config.bot.color as ColorResolvable)
			.setFooter({
				text: '©️ MajoBot'
			});
		context.reply({
			embeds: [embed]
		});
	}
	async clear(context: Message | CommandInteraction, amount: string) {
		if (isNaN(parseInt(amount)))
			return context.reply({
				content: 'You did not provide a valid number.'
			});
		const am = parseInt(amount);

		if (am < 1) return context.reply({ content: 'Please provide a number equal to 1 or more.' });
		if (am > 100) return context.reply({ content: 'Due to limits,  you can only purge up to 100 messages at a time!' });
		await (context.channel as TextChannel).bulkDelete(am);
		context instanceof CommandInteraction
			? await context.reply({
					content: `Deleted ${am} messages!`
			  })
			: await context.channel.send({
					content: `Deleted ${am} messages`
			  });
	}
	async nuke(context: Message | CommandInteraction, channel: TextChannel) {
		let a = new MessageButton().setCustomId('accept').setStyle('SECONDARY').setEmoji('<:check:1006661506877898762>');

		let b = new MessageButton().setCustomId('decline').setStyle('SECONDARY').setEmoji('<:cross:1006661508295565393>');

		let row = new MessageActionRow().addComponents(a, b);
		const collector = context.channel?.createMessageComponentCollector({ componentType: 'BUTTON', time: 30000 });
		await context.reply({
			embeds: [
				new MessageEmbed()
					.setTitle('Nuke?')
					.setDescription(`Are you sure you want to nuke this channel?`)
					.addFields({
						name: 'Click the according emoji to confirm',
						value: '<:check:1006661506877898762> To nuke, <:cross:1006661508295565393> To cancel the process'
					})
					.setColor(this.client.config.bot.color as ColorResolvable)
			],
			components: [row]
		});

		collector?.on('collect', async (m) => {
			if (m.customId === 'accept') {
				const chn2 = await channel.clone();
				await chn2.setPosition(channel.position);
				await chn2.setTopic(channel.topic);
				await channel.delete();
				await chn2.send({ content: 'Nuked this channel! https://imgur.com/LIyGeCR' });
			} else {
				await context.reply({
					content: 'Cancelled the process!'
				});
			}
		});
	}
	slowmode(context: Message | CommandInteraction, time: number) {
		(context.channel as TextChannel).setRateLimitPerUser(time);
		context.reply({
			content: `The slowmode is now: \`${time}\``
		});
	}
}

export class WarnClient {
	public client: SapphireClient;
	private model: any;
	constructor(client: SapphireClient) {
		this.client = client;
		setTimeout(() => {
			this.model = client.databases.raw.getRepository(Warnings);
		}, 5000);
	}
	async add(guildID: Snowflake, id: Snowflake, content: any, author: GuildMember) {
		let data;
		const m = await this.model.findOne({
			guildID: guildID,
			id: id
		});
		if (!m) {
			const d: any = {
				moderatorID: author.id,
				moderatorTAG: author.user.tag,
				reason: content.reason,
				date: new Date().toLocaleDateString(),
				id: 0
			};
			data = this.model.create({
				guildID,
				id,
				content: [d]
			});
			this.model.save(data);
		} else {
			const d: any = {
				moderatorID: author.id,
				moderatorTAG: author.user.tag,
				reason: content.reason,
				date: new Date().toLocaleDateString(),
				id: m.content.length + 1
			};
			m.content.push(d);
			this.model.save(m);
		}
		return data;
	}
	async get(guildID: Snowflake, id: Snowflake) {
		let data = await this.model.findOne({
			id,
			guildID
		});
		if (data) {
			return data;
		} else {
			return false;
		}
	}
	async remove(guildID: Snowflake, id: Snowflake, warnID: any) {
		const m = await this.model.findOne({
			id,
			guildID
		});
		if (!m) {
			return false;
		} else {
			try {
				m.content.splice(warnID, 1);
				this.model.save(m);
				return m;
			} catch {
				return false;
			}
		}
	}
	async clear(guildID: Snowflake, id: Snowflake) {
		const m = await this.model.findOne({
			id,
			guildID
		});
		if (!m) {
			return false;
		} else {
			this.model.findOneAndDelete({
				id,
				guildID
			});
			return true;
		}
	}
}
