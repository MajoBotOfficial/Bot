import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();
export class InitDatabase {
	static async Init() {
		return new DataSource({
			database: 'Data',
			entities: [__dirname + '/Entities/*.{ts,js}'],
			migrations: ['src/migration/**/*.ts'],
			type: 'mongodb',
			logging: true,
			synchronize: true,
			url: process.env.DATABASE_URL as string,
			useUnifiedTopology: true
		}).connect();
	}
}
