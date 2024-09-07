import type { FileService } from '../interfaces/file.interface';
import {
	PaginationParams,
	PaginationResult,
} from '../interfaces/http.interface';
import type {
	UserRepository,
	UserResult,
	UserTable,
} from '../interfaces/user.interface';
import { findAllUsers } from './find-all-users.use-case';

describe('findAllUsers', () => {
	let userRepository: UserRepository;
	let fileService: FileService;

	const params: PaginationParams = {
		limit: 10,
		page: 1,
	};
	const result: PaginationResult<UserTable> = {
		data: [],
		meta: {
			...params,
			total: 1,
		},
	};

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
			findAll: jest.fn().mockReturnValue(
				Promise.resolve<PaginationResult<UserTable>>({
					...result,
					data: [user],
				})
			),
			findOne: jest.fn(),
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

	test('should return empty array', async () => {
		userRepository.findAll = jest
			.fn()
			.mockReturnValue(Promise.resolve<PaginationResult<UserTable>>(result));

		const { data, meta } = await findAllUsers(
			userRepository,
			fileService,
			params
		);

		expect<UserRepository['findAll']>(
			userRepository.findAll
		).toHaveBeenCalledTimes(1);
		expect<FileService['getUrl']>(fileService.getUrl).toHaveBeenCalledTimes(0);
		expect<UserResult[]>(data).toStrictEqual(expect.arrayContaining([]));
		expect<PaginationResult['meta']>(meta).toStrictEqual<
			PaginationResult['meta']
		>(result.meta);
		expect<number>(meta.page).toStrictEqual<number>(result.meta.page);
		expect<number>(meta.limit).toStrictEqual<number>(result.meta.limit);
		expect<number>(meta.total).toStrictEqual<number>(result.meta.total);
	});

	test('should return all users', async () => {
		const { data, meta } = await findAllUsers(
			userRepository,
			fileService,
			params
		);

		expect<UserRepository['findAll']>(
			userRepository.findAll
		).toHaveBeenCalledTimes(1);
		expect<FileService['getUrl']>(fileService.getUrl).toHaveBeenCalledTimes(0);
		expect<UserResult[]>(data).toStrictEqual(
			expect.arrayContaining([
				{
					...user,
					avatar: null,
				},
			])
		);
		expect<PaginationResult['meta']>(meta).toStrictEqual<
			PaginationResult['meta']
		>(result.meta);
		expect<number>(meta.page).toStrictEqual<number>(result.meta.page);
		expect<number>(meta.limit).toStrictEqual<number>(result.meta.limit);
		expect<number>(meta.total).toStrictEqual<number>(result.meta.total);
	});

	test('should return all users with avatar', async () => {
		userRepository.findAll = jest.fn().mockReturnValue(
			Promise.resolve<PaginationResult<UserTable>>({
				...result,
				data: [
					{
						...user,
						photo: 'photo.png',
					},
				],
			})
		);

		const { data, meta } = await findAllUsers(
			userRepository,
			fileService,
			params
		);

		expect<UserRepository['findAll']>(
			userRepository.findAll
		).toHaveBeenCalledTimes(1);
		expect<FileService['getUrl']>(fileService.getUrl).toHaveBeenCalledTimes(1);
		expect<UserResult[]>(data).toStrictEqual(
			expect.arrayContaining([
				{
					...user,
					photo: 'photo.png',
					avatar: 'avatar.png',
				},
			])
		);
		expect<PaginationResult['meta']>(meta).toStrictEqual<
			PaginationResult['meta']
		>(result.meta);
		expect<number>(meta.page).toStrictEqual<number>(result.meta.page);
		expect<number>(meta.limit).toStrictEqual<number>(result.meta.limit);
		expect<number>(meta.total).toStrictEqual<number>(result.meta.total);
	});
});
