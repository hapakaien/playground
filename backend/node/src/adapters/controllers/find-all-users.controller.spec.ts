import { StatusCodes } from 'http-status-codes';
import { mockedFindAllUsers } from '../../../__tests__/mocks/user.mock';
import type { FileService } from '../../core/interfaces/file.interface';
import { PaginationResult } from '../../core/interfaces/http.interface';
import type {
	UserRepository,
	UserResult,
	UserTable,
} from '../../core/interfaces/user.interface';
import type {
	HttpRequest,
	JsonApiPagination,
} from '../interfaces/http.interface';
import { findAllUsersController } from './find-all-users.controller';

describe('findAllUsersController', () => {
	const userRepository: UserRepository = {
		create: jest.fn(),
		findAll: jest.fn(),
		findOne: jest.fn(),
		findOneByEmail: jest.fn(),
		update: jest.fn(),
		remove: jest.fn(),
		truncate: jest.fn(),
	};
	const fileService: FileService = {
		upload: jest.fn(),
		getUrl: jest.fn(),
		remove: jest.fn(),
	};

	const controller = findAllUsersController(userRepository, fileService);

	const request: HttpRequest<unknown, JsonApiPagination> = {
		headers: {},
		params: {
			page: {
				size: 10,
				number: 1,
			},
		},
		body: {},
		user: {},
		cookies: {},
	};
	const result: PaginationResult<UserResult> = {
		data: [],
		meta: {
			page: Number(request.params?.page.number),
			limit: Number(request.params?.page.size),
			total: 1,
		},
	};

	let user: UserTable = {
		id: 'id',
		first_name: 'John',
		last_name: 'Doe',
		nickname: null,
		email: 'johndoe@example.com',
		created_at: '2022-06-11 01:55:13',
		updated_at: '2022-06-11 01:55:13',
	};

	beforeEach(() => {
		mockedFindAllUsers.mockImplementation(() => {
			return Promise.resolve<PaginationResult<UserResult>>({
				...result,
				data: [
					{
						...user,
						avatar: user.photo ? 'avatar.png' : null,
					},
				],
			});
		});
	});

	test('should return empty array', async () => {
		mockedFindAllUsers.mockReturnValue(
			Promise.resolve<PaginationResult<UserResult>>(result)
		);

		const { status, data, meta } = await controller(request);

		expect(status).toStrictEqual<StatusCodes>(StatusCodes.OK);
		expect(data).toStrictEqual([]);
		expect(meta).toStrictEqual<PaginationResult['meta']>(result.meta);
		expect(meta?.page).toStrictEqual<number>(result.meta.page);
		expect(meta?.limit).toStrictEqual<number>(result.meta.limit);
		expect(meta?.total).toStrictEqual<number>(result.meta.total);
	});

	test('should return all users', async () => {
		const { data, status, meta } = await controller(request);

		expect(status).toStrictEqual<StatusCodes>(StatusCodes.OK);
		expect(data).toStrictEqual(
			expect.arrayContaining([
				{
					...user,
					avatar: null,
				},
			])
		);
		expect(meta).toStrictEqual<PaginationResult['meta']>(result.meta);
		expect(meta?.page).toStrictEqual<number>(result.meta.page);
		expect(meta?.limit).toStrictEqual<number>(result.meta.limit);
		expect(meta?.total).toStrictEqual<number>(result.meta.total);
	});

	test('should return all users with avatar', async () => {
		user = {
			...user,
			photo: 'photo.png',
		};

		const { data, status, meta } = await controller(request);

		expect(status).toStrictEqual<StatusCodes>(StatusCodes.OK);
		expect(data).toStrictEqual(
			expect.arrayContaining([
				{
					...user,
					avatar: 'avatar.png',
				},
			])
		);
		expect(meta).toStrictEqual<PaginationResult['meta']>(result.meta);
		expect(meta?.page).toStrictEqual<number>(result.meta.page);
		expect(meta?.limit).toStrictEqual<number>(result.meta.limit);
		expect(meta?.total).toStrictEqual<number>(result.meta.total);
	});
});
