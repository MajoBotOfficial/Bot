import { Snowflake } from 'discord.js';
import { Entity, Column, ObjectID, ObjectIdColumn, PrimaryColumn } from 'typeorm';
import settings from '../../../../settings.json';

@Entity({ name: 'guilds' })
export class GuildEntity {
	@ObjectIdColumn()
	public _id!: ObjectID;

	@PrimaryColumn('string')
	public id!: Snowflake;

	@Column('string')
	public prefix = settings.prefix;
}
