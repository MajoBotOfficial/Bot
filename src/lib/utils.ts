import { send } from '@sapphire/plugin-editable-commands';
import { Message, MessageEmbed } from 'discord.js';
import { fetchLanguage, LocalizedInteractionReplyOptions, resolveKey } from '@sapphire/plugin-i18next';
import { Command, container } from '@sapphire/framework';
import ChatInputInteraction = Command.ChatInputInteraction;

/**
 * Picks a random item from an array
 * @param array The array to pick a random item from
 * @example
 * const randomEntry = pickRandom([1, 2, 3, 4]) // 1
 */
export function pickRandom<T>(array: readonly T[]): T {
	const { length } = array;
	return array[Math.floor(Math.random() * length)] as T;
}

/**
 * Sends a loading message to the current channel
 * @param message The message data for which to send the loading message
 */
export async function sendLoadingMessage(message: Message): Promise<typeof message> {
	const randomArr = [
		await resolveKey(message, 'utils:constants:computing'),
		await resolveKey(message, 'utils:constants:loading'),
		await resolveKey(message, 'utils:constants:moment')
	];
	return send(message, { embeds: [new MessageEmbed().setDescription(pickRandom(randomArr)).setColor('#FF0000')] });
}

export function untilLength(arr: readonly string[], maxLength = 17, separator = ', '): string {
	const returnArr: string[] = [];
	for (let i = 0; returnArr.join(separator).length <= maxLength; i += 1) {
		if (!arr[i]) break;
		returnArr.push(arr[i] as string);
	}
	if (returnArr.join(separator).length < arr.join(separator).length) return `${returnArr.join(separator)}, ...`;
	return returnArr.join(separator);
}

export async function replyLocalized(interaction: ChatInputInteraction, options: LocalizedInteractionReplyOptions) {
	if (interaction.replied || interaction.deferred) {
		return await interaction.editReply({
			content: container.i18n.format(await fetchLanguage(interaction), options.keys, {
				replace: options.formatOptions
			}) as string
		});
	}
	return await interaction.reply({
		content: container.i18n.format(await fetchLanguage(interaction), options.keys, {
			replace: options.formatOptions
		}) as string,
		fetchReply: true
	});
}
