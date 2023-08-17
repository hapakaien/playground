import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { HashService } from '../interfaces/hash.interface';
import type {
	CreateUserDto,
	UserRepository,
	UserResult,
	UserTable,
	UserTableInput,
} from '../interfaces/user.interface';
import { createUser } from './create-user.use-case';

describe('createUser', () => {
	let userRepository: UserRepository;
	let hashService: HashService;

	const dto: CreateUserDto = {
		name: 'John Doe',
		email: 'johndoe@example.com',
		password: 'abogoboga',
		password_confirmation: 'abogoboga',
	};

	const user: UserTable = {
		id: 'id',
		name: dto.name,
		nickname: null,
		email: dto.email,
		email_verified_at: null,
		password: dto.password,
		created_at: '2022-06-11 01:55:13',
		updated_at: '2022-06-11 01:55:13',
	};

	beforeEach(() => {
		userRepository = {
			create: vi.fn((data: UserTableInput) => {
				return Promise.resolve<UserTable>({ ...user, ...data });
			}),
			findAll: vi.fn(),
			findOne: vi.fn(),
			findOneByEmail: vi.fn(),
			update: vi.fn(),
			remove: vi.fn(),
			truncate: vi.fn(),
		};

		hashService = {
			create: vi.fn(),
			verify: vi.fn(),
		};
	});

	test('should throw error when user is not saved', async () => {
		userRepository.create = vi.fn().mockReturnValue(Promise.resolve(null));

		await expect(createUser(dto, userRepository, hashService)).rejects.toThrow(
			new Error('Something went wrong.')
		);
	});

	test('should create an user', async () => {
		const data = await createUser(dto, userRepository, hashService);

		const { password, ...result } = user;

		expect(userRepository.create).toBeCalledTimes(1);
		expect(hashService.create).toBeCalledTimes(1);
		expect(data).toEqual<UserResult>({ ...result, avatar: null });
	});
});
