import { getErrorMessage } from '../entities/validation.entity';
import { NotFoundException } from '../exceptions/not-found.exception';
import type { FileService } from '../interfaces/file.interface';
import type {
	UpdateUserDto,
	UserRepository,
	UserResult,
	UserTable,
	UserTableInput,
} from '../interfaces/user.interface';
import { updateUser } from './update-user.use-case';

describe('updateUser', () => {
	let userRepository: UserRepository;
	let fileService: FileService;

	let user: UserTable = {
		id: 'id',
		first_name: 'John',
		last_name: 'Doe',
		nickname: null,
		email: 'johndoe@example.com',
		photo: '',
		created_at: '2022-06-11 01:55:13',
		updated_at: '2022-06-11 01:55:13',
	};

	let dto: UpdateUserDto = {};

	beforeEach(() => {
		userRepository = {
			create: jest.fn(),
			findAll: jest.fn(),
			findOne: jest.fn(),
			findOneByEmail: jest.fn(),
			update: jest.fn((id: string, data: Partial<UserTableInput>) => {
				if (id !== user.id) {
					return Promise.resolve<null>(null);
				}

				return Promise.resolve<UserTable>({ ...user, ...data });
			}),
			remove: jest.fn(),
			truncate: jest.fn(),
		};

		fileService = {
			upload: jest.fn(),
			getUrl: jest.fn().mockImplementation((_path: string) => {
				if (!user.photo) {
					return Promise.resolve<null>(null);
				}

				return Promise.resolve<string>('avatar.png');
			}),
			remove: jest.fn(),
		};
	});

	test('should throw error when user not found', async () => {
		await expect<Promise<UserResult>>(
			updateUser('invalid-id', dto, userRepository, fileService)
		).rejects.toThrow(new NotFoundException(getErrorMessage('user.exist')));
	});

	test("should only update user's name", async () => {
		dto = {
			first_name: 'Jane',
			last_name: 'Doe',
		};

		const data = await updateUser('id', dto, userRepository, fileService);

		expect<UserResult>(data).toStrictEqual<UserResult>({
			...user,
			...dto,
			avatar: null,
		});
	});

	test("should only update user's nickname", async () => {
		dto = {
			nickname: 'John',
		};

		const data = await updateUser('id', dto, userRepository, fileService);

		expect<UserResult>(data).toStrictEqual<UserResult>({
			...user,
			...dto,
			avatar: null,
		});
	});

	test("should only update user's email", async () => {
		dto = {
			email: 'janedoe@example.com',
		};

		const data = await updateUser('id', dto, userRepository, fileService);

		expect<UserResult>(data).toStrictEqual<UserResult>({
			...user,
			...dto,
			avatar: null,
		});
	});

	test("should only update existing user's avatar", async () => {
		dto = {};
		user = {
			...user,
			photo: 'photo.png',
		};

		const data = await updateUser('id', dto, userRepository, fileService);

		expect<UserResult>(data).toStrictEqual<UserResult>({
			...user,
			photo: 'photo.png',
			avatar: 'avatar.png',
		});
	});
});
