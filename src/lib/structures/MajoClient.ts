import { LogLevel, SapphireClient } from '@sapphire/framework';
import settings from '../../../settings.json';
import * as dotenv from 'dotenv';
import type { Message } from 'discord.js';
import { GuildDatabaseManager } from '../database/Managers/GuildManager';
import { InitDatabase } from '../database/Database';
import MajoConfig, { IConfig } from './MajoConfig';
import type { DataSource } from 'typeorm';

dotenv.config();

export class MajoClient extends SapphireClient {
	public constructor() {
		// We call super our options
		super({
			caseInsensitiveCommands: true,
			api: {
				listenOptions: {
					port: 3001
				}
			},
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
			loadMessageCommandListeners: true,
			i18n: {
				fetchLanguage: async (context) => {
					if (!context.guild) return 'english';
					const settings = await this.databases.guilds.get(context.guild.id);

					return settings.language;
				}
			},
			presence: {
				status: 'online',
				activities: [
					{
						name: 'you',
						type: 'WATCHING'
					}
				]
			}
		});
	}
	public override async login() {
		const data = await InitDatabase.Init();
		const manager = new GuildDatabaseManager();
		new MajoConfig(this);

		manager._init(data);
		this.databases = { guilds: manager, raw: data };
		return super.login(process.env.TOKEN);
	}
	public override fetchPrefix = async (message: Message): Promise<string[]> => {
		if (!message.guild) return [this.options.defaultPrefix, ''] as string[];

		const guild = await this.databases.guilds.get(message.guildId as string);

		if (!guild) {
			return [this.options.defaultPrefix, ''] as string[];
		}
		return [guild.prefix, ''];
	};
}
declare module '@sapphire/framework' {
	interface SapphireClient {
		databases: {
			guilds: GuildDatabaseManager;
			raw: DataSource;
		};
		config: IConfig;
	}
}
