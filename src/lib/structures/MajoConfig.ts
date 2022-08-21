import type { MajoClient } from './MajoClient';
import defaultSettings from '../../../settings.example.json';

export interface IConfig {
	prefix: string;
	owners: string[];
	channels: {
		guild_create: string;
		guild_delete: string;
		error_log: string;
	};
	bot: {
		color: string;
	};
}
export default class MajoConfig {
	public client: MajoClient;
	public config: IConfig;
	constructor(client: MajoClient) {
		this.client = client;
		this.config = defaultSettings;
		this._init();
	}
	async _init() {
		this.config = (await import('../../../settings.json')) ? await import('../../../settings.json') : defaultSettings;
		this.client.config = this.config;
		return this;
	}
}
