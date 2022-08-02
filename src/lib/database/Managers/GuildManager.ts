import Collection from '@discordjs/collection';
import { Snowflake } from 'discord.js';
import { DataSource, Repository } from 'typeorm';
import { GuildEntity } from '../Entities/Guild';

export class GuildDatabaseManager {
	public repository!: Repository<GuildEntity>;
	public cache: Collection<Snowflake, GuildEntity> = new Collection();

	public _init(source: DataSource) {
		this.repository = source.getRepository(GuildEntity);
	}

	public async get(id: Snowflake): Promise<GuildEntity> {
		const cache = await this.cache.get(id);
		if (cache) return cache;
		const data = await this.repository.findOne({
			where: {
				id
			}
		});
		if (!data) {
			const createdData = this.repository.create({ id });
			if (this.repository) await this.cache.set(id, createdData);
			await this.repository.save(createdData);
			return createdData;
		}
		if (this.repository) await this.cache.set(id, data);
		return data;
	}

	public async set(id: Snowflake, key: keyof GuildEntity, value: any): Promise<GuildEntity> {
		const data = (await this.repository.findOne({ where: { id } })) ?? this.repository.create({ id });
		// @ts-ignore
		data[key] = value;
		await this.repository.save(data);
		await this.cache.set(id, data);
		return data;
	}
	public async delete(id: Snowflake) {
		await this.repository.delete({ id });
		return this.cache.delete(id);
	}
}
