import { LogLevel, SapphireClient } from '@sapphire/framework';
import settings from '../../../settings.json';
import * as dotenv from 'dotenv';
import { Message } from 'discord.js';
import { GuildDatabaseManager } from '../database/Managers/GuildManager';
import { InitDatabase } from '../database/Database';

dotenv.config();

export class MajoClient extends SapphireClient {
	public constructor() {
		// We call super our options
		super({
			caseInsensitiveCommands: true,
			logger: {
				level: LogLevel.Info
			},
			caseInsensitivePrefixes: true,
			defaultPrefix: settings.prefix,
			intents: [
				'GUILDS',
				'GUILD_MEMBERS',
				'GUILD_BANS',
				'GUILD_EMOJIS_AND_STICKERS',
				'GUILD_VOICE_STATES',
				'GUILD_MESSAGES',
				'GUILD_MESSAGE_REACTIONS',
				'DIRECT_MESSAGES',
				'DIRECT_MESSAGE_REACTIONS'
			],
			loadDefaultErrorListeners: false,
			loadMessageCommandListeners: true
		});
	}
	public override async login() {
		const data = await InitDatabase.Init();
		const manager = new GuildDatabaseManager();

		manager._init(data);
		this.databases = { guilds: manager };
		return super.login(process.env.TOKEN);
	}
	public override fetchPrefix = async (message: Message) => {
		if (!message.guild) return [this.options.defaultPrefix, ''] as readonly string[];

		const guild = await this.databases.guilds.get(message.guildId as string);

		if (!guild) {
			return [this.options.defaultPrefix, ''] as readonly string[];
		}
		return [guild.prefix, ''];
	};
}
declare module '@sapphire/framework' {
	interface SapphireClient {
		databases: {
			guilds: GuildDatabaseManager;
		};
	}
}
