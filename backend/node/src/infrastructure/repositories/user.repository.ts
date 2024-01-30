import type {
	UserRepository,
	UserTable,
	UserTableInput,
} from '../../core/interfaces/user.interface';
import { db } from '../ports/database';

export const userRepository: UserRepository = {
	create: async (input: UserTableInput): Promise<UserTable | null> => {
		const records = await db<UserTable>('users')
			.insert(input)
			.returning([
				'id',
				'first_name',
				'last_name',
				'nickname',
				'email',
				'photo',
				'created_at',
				'updated_at',
			]);

		if (!records.length) {
			return null;
		}

		const result = records.at(0) as UserTable;

		return result;
	},

	findAll: async () => {
		const records = await db<UserTable>('users').select(
			'id',
			'first_name',
			'last_name',
			'nickname',
			'email',
			'photo',
			'created_at',
			'updated_at'
		);

		const result = records;

		return result;
	},

	findOne: async (id: string) => {
		const record = await db<UserTable>('users')
			.where('id', '=', id)
			.first(
				'id',
				'first_name',
				'last_name',
				'nickname',
				'email',
				'photo',
				'created_at',
				'updated_at'
			);

		if (!record) {
			return null;
		}

		const result = record;

		return result;
	},

	findOneByEmail: async (email: string, id?: string) => {
		const record = await db<UserTable>('users')
			.where('email', '=', email)
			.modify<UserTable, UserTable>((query) => {
				if (id) {
					// eslint-disable-next-line @typescript-eslint/no-floating-promises
					query.andWhereNot('id', '=', id);
				}
			})
			.first(
				'id',
				'first_name',
				'last_name',
				'nickname',
				'email',
				'photo',
				'created_at',
				'updated_at'
			);

		if (!record) {
			return null;
		}

		const result: UserTable = record;

		return result;
	},

	update: async (id: string, input: Partial<UserTableInput>) => {
		const record = await db<UserTable>('users')
			.where('id', '=', id)
			.update({ ...input, updated_at: db.fn.now() })
			.returning([
				'id',
				'first_name',
				'last_name',
				'nickname',
				'email',
				'photo',
				'created_at',
				'updated_at',
			]);

		if (!record.length) {
			return null;
		}

		const result = record.at(0) as UserTable;

		return result;
	},

	remove: async (id: string) => {
		const record = await db<UserTable>('users')
			.where('id', '=', id)
			.delete()
			.returning([
				'id',
				'first_name',
				'last_name',
				'nickname',
				'email',
				'photo',
				'created_at',
				'updated_at',
			]);

		if (!record.length) {
			return null;
		}

		const result = record.at(0) as UserTable;

		return result;
	},

	truncate: async () => {
		await db<UserTable>('users').truncate();
	},
};
