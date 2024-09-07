import type { UserTable } from '../../src/core/interfaces/user.interface';
import { userRepository } from '../../src/infrastructure/repositories/user.repository';

export const user: Omit<UserTable, 'created_at' | 'updated_at'> = {
	id: 'c9b1dbe1-6eb7-463e-bfa5-4733d195bad9',
	first_name: 'John',
	last_name: 'Doe',
	email: 'johndoe@example.com',
};

const { id, ...tempUser } = user;

export const testUser: Omit<UserTable, 'id' | 'created_at' | 'updated_at'> = {
	...tempUser,
	first_name: 'Jane',
	last_name: 'Doe',
	email: 'janedoe@example.com',
};

export async function setup() {
	await userRepository.truncate();

	await userRepository.create({
		...user,
	});
}
