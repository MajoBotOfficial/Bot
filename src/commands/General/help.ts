import { ApplyOptions } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { MessageEmbed } from 'discord.js';
import { sendLoadingMessage } from '../../lib/utils';
import { MajoCommand, MajoCommandOptions } from '../../lib/structures/MajoCommand';
import { MajoClient } from '../../lib/structures/MajoClient';
import { resolveKey } from '@sapphire/plugin-i18next';

@ApplyOptions<MajoCommandOptions>({
	name: 'help',
	description: 'ping pong',
	fullCategory: ['General']
})
export class HelpCommand extends MajoCommand {
	public override async messageRun(message: Message, args: Args) {
		const cmd = await args.pick('string').catch(() => null);
		const response = await sendLoadingMessage(message);
		if (!cmd) {
			const paginatedMessage = new PaginatedMessage({
				template: new MessageEmbed().setColor('#FF0000').setFooter({ text: ' ©️ Majobot' })
			});
			const groups = [...this.container.stores.get('commands').values()].map((cmd) => cmd.category);
			for (const group of [...new Set(groups)]) {
				const cmds = [...this.container.stores.get('commands').values()].filter((cmd) => cmd.category === group).map((cmd) => cmd.name);
				paginatedMessage.addPageEmbed(
					new MessageEmbed()
						.setTitle(await resolveKey(message, `categories:${group as string}`))
						.setDescription(`${cmds.join(', ')}`)
						.setTimestamp()
				);
			}

			await paginatedMessage.run(response, message.author);
			return response;
		} else {
			const command = this.container.client.stores.get('commands').get(cmd) as MajoCommand;
			if (!command) {
				return response.edit({
					embeds: [
						{
							color: 'RED',
							description: (await resolveKey(message, 'commands:help:not_found')) as string
						}
					]
				});
			}
			const examples = command.examples
				? await Promise.all(
						command.examples?.map(
							async (cmd) => `\`${(await (this.container.client as MajoClient).fetchPrefix(message)).join('')}${cmd}\``
						)
				  )
				: await resolveKey(message, 'commands:help:no_examples');
			return response.edit({
				embeds: [
					{
						title: command.name,
						fields: [
							{
								name: await resolveKey(message, 'commands:help:description'),
								value: command.description || (await resolveKey(message, 'commands:help:no_description'))
							},
							{
								name: await resolveKey(message, 'commands:help:group'),
								value: command.fullCategory[0] as string
							},
							{
								name: await resolveKey(message, 'commands:help:aliases'),
								value: command.aliases.join(', ') || (await resolveKey(message, 'commands:help:no_aliases'))
							},
							{
								name: await resolveKey(message, 'commands:help:examples'),
								value: Array.isArray(examples) ? examples.join(', ') : (examples as string)
							}
						]
					}
				]
			});
		}
	}
}
