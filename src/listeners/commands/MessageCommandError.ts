import { ArgumentError, Events, MessageCommandErrorPayload, ResultError, UserError } from '@sapphire/framework';
import { Listener, PieceContext } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class CoreEvent extends Listener<typeof Events.MessageCommandError> {
	public constructor(context: PieceContext) {
		super(context, { event: Events.MessageCommandError });
	}

	public run(error: ResultError<any>, context: MessageCommandErrorPayload) {
		if (error.value instanceof ArgumentError) return this.argumentError(context.message, error.value);
		if (error.value instanceof UserError) return this.userError(context.message, error.value, context);
		return console.log(error as any);
	}
	private argumentError(message: Message, error: ArgumentError<unknown>) {
		const argument = error.argument.name;
		const identifier = error.identifier;
		const parameter = error.parameter.replaceAll('`', '῾');
		return this.send(message, `Missing ${argument} from ${identifier} ${parameter}`);
	}
	private userError(message: Message, error: UserError, ctx: MessageCommandErrorPayload) {
		if (Reflect.get(Object(error.context), 'silent')) return;

		return this.send(
			message,
			`You need to write another parameter!\n\n> **Tip**: You can do \`${ctx.context.commandPrefix}help ${ctx.command.name}\` to find out how to use this command.`
		);
	}

	private send(message: Message, content: string) {
		message.channel.send({ content, allowedMentions: { users: [message.author.id], roles: [] } });
	}
}
