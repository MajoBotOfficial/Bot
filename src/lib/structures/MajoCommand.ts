import { Command, CommandOptions } from '@sapphire/framework';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';

export interface MajoCommandOptions extends CommandOptions {
	examples?: string[];
}
export interface MajoSubCommandOptions extends SubCommandPluginCommandOptions {
	examples?: string[];
}
export class MajoCommand extends Command {
	public examples?: string[] | undefined;
	constructor(context: Command.Context, options: MajoCommandOptions) {
		super(context, options);
		this.examples = options.examples;
	}
}
export class MajoSubCommand extends SubCommandPluginCommand {
	public examples?: string[] | undefined;
	constructor(context: SubCommandPluginCommand.Context, options: MajoSubCommandOptions) {
		super(context, options);
		this.examples = options.examples || [];
	}
}
