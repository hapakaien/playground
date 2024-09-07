import { getErrorMessage } from '../entities/validation.entity';
import { NotFoundException } from '../exceptions/not-found.exception';
import type { FileService } from '../interfaces/file.interface';
import type { UserRepository, UserTable } from '../interfaces/user.interface';
import { removeUser } from './remove-user.use-case';

describe('removeUser', () => {
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
			findOne: jest.fn(),
			findOneByEmail: jest.fn(),
			update: jest.fn(),
			remove: jest.fn((id: string) => {
				if (id !== user.id) {
					return Promise.resolve<null>(null);
				}

				return Promise.resolve<UserTable>(user);
			}),
			truncate: jest.fn(),
		};

		fileService = {
			upload: jest.fn(),
			getUrl: jest.fn(),
			remove: jest.fn(),
		};
	});

	test('should throw error when user not found', async () => {
		await expect(
			removeUser('invalid-id', userRepository, fileService)
		).rejects.toThrow(new NotFoundException(getErrorMessage('user.exist')));
	});

	test('should delete user with no avatar', async () => {
		await removeUser('id', userRepository, fileService);

		expect<UserRepository['remove']>(
			userRepository.remove
		).toHaveBeenCalledTimes(1);
		expect<FileService['remove']>(fileService.remove).toHaveBeenCalledTimes(0);
	});

	test('should delete user with an avatar', async () => {
		userRepository.remove = jest.fn().mockReturnValue(
			Promise.resolve({
				...user,
				photo: 'photo.png',
			})
		);

		await removeUser('id', userRepository, fileService);

		expect<UserRepository['remove']>(
			userRepository.remove
		).toHaveBeenCalledTimes(1);
		expect<FileService['remove']>(fileService.remove).toHaveBeenCalledTimes(1);
	});
});
