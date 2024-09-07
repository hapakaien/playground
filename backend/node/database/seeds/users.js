// eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-var-requires
const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function seed(knex) {
	await knex('users').del();

	await knex('users').insert({
		first_name: 'John',
		last_name: 'Doe',
		nickname: 'John',
		email: 'johndoe@example.com',
	});

	// eslint-disable-next-line no-plusplus
	for (let index = 0; index < 50; index++) {
		// eslint-disable-next-line no-await-in-loop
		await knex('users').insert({
			first_name: faker.person.firstName(),
			last_name: faker.person.lastName(),
			nickname: faker.person.firstName(),
			email: faker.internet.email().toLowerCase(),
		});
	}
};
