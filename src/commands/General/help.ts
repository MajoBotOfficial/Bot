import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { MessageEmbed } from 'discord.js';
import { sendLoadingMessage } from '../../lib/utils';

@ApplyOptions<CommandOptions>({
	name: 'help',
	description: 'ping pong',
	fullCategory: ['General']
})
export class UserCommand extends Command {
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
						.setTitle(group as string)
						.setDescription(`${cmds.join(', ')}`)
						.setTimestamp()
				);
			}

			await paginatedMessage.run(response, message.author);
			return response;
		} else {
			const command = this.container.client.stores.get('commands').get(cmd);
			if (!command) {
				return response.edit({
					embeds: [
						{
							color: 'RED',
							description: 'Command not found.'
						}
					]
				});
			}
			return response.edit({
				embeds: [
					{
						title: command.name,
						fields: [
							{
								name: 'Description',
								value: command.description || 'No description.'
							},
							{
								name: 'Category',
								value: command.fullCategory[0] as string
							},
							{
								name: 'Aliases',
								value: command.aliases.join(', ') || 'No aliases.'
							}
						]
					}
				]
			});
		}
	}
}
