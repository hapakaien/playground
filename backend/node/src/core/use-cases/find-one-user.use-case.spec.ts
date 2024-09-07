import { getErrorMessage } from '../entities/validation.entity';
import { NotFoundException } from '../exceptions/not-found.exception';
import type { FileService } from '../interfaces/file.interface';
import type {
	UserRepository,
	UserResult,
	UserTable,
} from '../interfaces/user.interface';
import { findOneUser } from './find-one-user.use-case';

describe('findOneUser', () => {
	let userRepository: UserRepository;
	let fileService: FileService;

	const user: UserTable = {
		id: 'id',
		first_name: 'John',
		last_name: 'Doe',
		nickname: null,
		email: 'johndoe@example.com',
		created_at: '2022-06-11 01:55:13',
		updated_at: '2022-06-11 01:55:13',
	};

	beforeEach(() => {
		userRepository = {
			create: jest.fn(),
			findAll: jest.fn(),
			findOne: jest.fn((id: string) => {
				if (id !== user.id) {
					return Promise.resolve(null);
				}

				return Promise.resolve<UserTable>(user);
			}),
			findOneByEmail: jest.fn(),
			update: jest.fn(),
			remove: jest.fn(),
			truncate: jest.fn(),
		};

		fileService = {
			upload: jest.fn(),
			getUrl: jest.fn().mockReturnValue(Promise.resolve<string>('avatar.png')),
			remove: jest.fn(),
		};
	});

	test('should throw error when user not found', async () => {
		await expect(
			findOneUser('invalid-id', userRepository, fileService)
		).rejects.toThrow(new NotFoundException(getErrorMessage('user.exist')));
	});

	test('should return an user without avatar', async () => {
		const data = await findOneUser(user.id, userRepository, fileService);

		expect<UserRepository['findOne']>(
			userRepository.findOne
		).toHaveBeenCalledTimes(1);
		expect<FileService['getUrl']>(fileService.getUrl).toHaveBeenCalledTimes(0);
		expect<UserResult>(data).toStrictEqual<UserResult>({
			...user,
			avatar: null,
		});
	});

	test('should return an user with avatar', async () => {
		userRepository.findOne = jest.fn().mockReturnValue(
			Promise.resolve({
				...user,
				photo: 'photo.png',
			})
		);

		const data = await findOneUser(user.id, userRepository, fileService);

		expect<UserRepository['findOne']>(
			userRepository.findOne
		).toHaveBeenCalledTimes(1);
		expect<FileService['getUrl']>(fileService.getUrl).toHaveBeenCalledTimes(1);
		expect<UserResult>(data).toStrictEqual<UserResult>({
			...user,
			photo: 'photo.png',
			avatar: 'avatar.png',
		});
	});
});
