/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
	client: 'pg',
	connection: {
		host: process.env.DB_HOST || '127.0.0.1',
		port: parseInt(String(process.env.DB_PORT), 10) || 5432,
		user: process.env.DB_USERNAME || 'postgres',
		password: process.env.DB_PASSWORD || 'postgres',
		database: process.env.DB_DATABASE || 'postgres',
	},
	pool: {
		min: 2,
		max: 10,
	},
	migrations: {
		tableName: 'migrations',
		directory: './database/migrations',
	},
	seeds: {
		directory: './database/seeds',
	},
};
