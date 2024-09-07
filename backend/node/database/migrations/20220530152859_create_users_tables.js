/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
	await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

	await knex.schema.createTable('users', (table) => {
		table
			.uuid('id')
			.notNullable()
			.defaultTo(knex.raw('uuid_generate_v4()'))
			.primary();
		table.string('first_name').notNullable();
		table.string('last_name').nullable();
		table.string('nickname').nullable();
		table.string('email').notNullable().unique();
		table.timestamp('email_verified_at').nullable();
		table.string('photo').nullable();
		table.timestamps(true, true);
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
	await knex.schema.raw('DROP TABLE IF EXISTS users');
};
