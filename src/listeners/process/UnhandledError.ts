import { Listener, ListenerOptions, PieceContext } from '@sapphire/framework';
import { MessageEmbed, TextChannel } from 'discord.js';
import settings from '../../../settings.json';

export default class UnhandledErrorListener extends Listener {
	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
			emitter: process,
			name: 'unhandledRejection'
		});
	}
	run(error: Error) {
		const embed = new MessageEmbed()
			.setTitle('Error')
			.setDescription(`\`\`\`${error.stack}\`\`\``)
			.setColor('RED')
			.addFields([
				{
					name: 'Message',
					value: error.message
				}
			]);
		return (this.container.client.channels.cache.get(settings.channels.error_log) as TextChannel).send({
			embeds: [embed]
		});
	}
}
