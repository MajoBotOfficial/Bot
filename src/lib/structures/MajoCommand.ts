import { Command, CommandOptions } from '@sapphire/framework';
import { Subcommand } from '@sapphire/plugin-subcommands';

export interface MajoCommandOptions extends CommandOptions {
	examples?: string[];
}
export interface MajoSubCommandOptions extends Subcommand.Options {
	examples?: string[];
}
export class MajoCommand extends Command {
	public examples?: string[] | undefined;
	constructor(context: Command.Context, options: MajoCommandOptions) {
		super(context, options);
		this.examples = options.examples;
	}
}
export class MajoSubCommand extends Subcommand {
	public examples?: string[] | undefined;
	constructor(context: Subcommand.Context, options: MajoSubCommandOptions) {
		super(context, options);
		this.examples = options.examples || [];
	}
}
