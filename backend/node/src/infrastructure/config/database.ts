import type { Knex } from 'knex';

export const databaseConfig: Knex.Config = {
	client: 'pg',
	connection: {
		host: process.env.DB_HOST || 'postgres',
		port: parseInt(String(process.env.DB_PORT), 10) || 5432,
		user: process.env.DB_USERNAME || 'postgres',
		password: process.env.DB_PASSWORD || 'postgres',
		database: process.env.DB_DATABASE || 'postgres',
	},
};
