import { container, Events, Listener } from '@sapphire/framework';
import settings from '../../../settings.json';
import { Guild, MessageEmbed, TextChannel } from 'discord.js';

export default class GuildDeleteListener extends Listener<typeof Events.GuildDelete> {
	async run(guild: Guild) {
		const embed = new MessageEmbed()
			.setTitle('Server left')
			.setDescription(`name: ${guild.name}\n ID: ${guild.id}\n membercount: ${guild.memberCount}`)
			.setFooter({
				text: '©️ Copyright Majobot'
			})
			.setColor('BLURPLE');
		await (container.client.channels.cache.get(settings.channels.guild_delete) as TextChannel).send({
			embeds: [embed]
		});
	}
}
