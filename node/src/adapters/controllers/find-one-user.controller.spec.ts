import { BadRequestException } from '../../core/exceptions/bad-request.exception';
import type { FileService } from '../../core/interfaces/file.interface';
import type {
	UserRepository,
	UserResult,
	UserTable,
} from '../../core/interfaces/user.interface';
import { findOneUser } from '../../core/use-cases/find-one-user.use-case';
import type { ResponseModel } from '../interfaces/common.interface';
import type { HttpRequestParams } from '../interfaces/http.interface';
import type {
	UserRequestParams,
	UserResponse,
} from '../interfaces/user.interface';
import { findOneUserController } from './find-one-user.controller';

jest.mock('../../core/use-cases/find-one-user.use-case');

describe('findOneUserController', () => {
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

	const controller = findOneUserController(userRepository, fileService);

	let request: HttpRequestParams<UserRequestParams> = {};

	let user: UserTable = {
		id: 'id',
		name: 'John Doe',
		nickname: null,
		email: 'johndoe@example.com',
		email_verified_at: null,
		password: 'abogoboga',
		created_at: '2022-06-11 01:55:13',
		updated_at: '2022-06-11 01:55:13',
	};

	const mockedFindOneUser = jest.mocked(findOneUser, true);

	beforeEach(() => {
		mockedFindOneUser.mockImplementation(() => {
			const { password, ...result } = user;

			return Promise.resolve<UserResult>({
				...result,
				avatar: user.photo ? 'avatar.png' : null,
			});
		});
	});

	test('should throw error when parameter is empty', async () => {
		await expect(controller(request)).rejects.toThrow(
			new BadRequestException('An id parameter is expexted.')
		);
	});

	test('should return an user', async () => {
		request = { ...request, params: { id: 'id' } };

		const data = await controller(request);
		const { password, ...result } = user;

		expect(data).toEqual<ResponseModel<UserResponse>>({
			status: 200,
			data: { ...result, avatar: null, type: 'users' },
		});
	});

	test('should return an user with avatar', async () => {
		user = { ...user, photo: 'photo.png' };

		const data = await controller(request);
		const { password, ...result } = user;

		expect(data).toEqual<ResponseModel<UserResponse>>({
			status: 200,
			data: { ...result, avatar: 'avatar.png', type: 'users' },
		});
	});
});
