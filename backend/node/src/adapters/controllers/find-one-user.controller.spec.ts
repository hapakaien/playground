import { StatusCodes } from 'http-status-codes';
import { mockedFindOneUser } from '../../../__tests__/mocks/user.mock';
import { BadRequestException } from '../../core/exceptions/bad-request.exception';
import type { FileService } from '../../core/interfaces/file.interface';
import type {
	UserRepository,
	UserResult,
	UserTable,
} from '../../core/interfaces/user.interface';
import type { ResponseModel } from '../interfaces/common.interface';
import type { HttpRequestParams } from '../interfaces/http.interface';
import type { UserRequestParams } from '../interfaces/user.interface';
import { findOneUserController } from './find-one-user.controller';

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
		first_name: 'John',
		last_name: 'Doe',
		nickname: null,
		email: 'johndoe@example.com',
		created_at: '2022-06-11 01:55:13',
		updated_at: '2022-06-11 01:55:13',
	};

	beforeEach(() => {
		mockedFindOneUser.mockImplementation(() => {
			return Promise.resolve<UserResult>({
				...user,
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
		request = {
			...request,
			params: {
				id: 'id',
			},
		};

		const data = await controller(request);

		expect<ResponseModel<UserResult>>(data).toStrictEqual<
			ResponseModel<UserResult>
		>({
			status: StatusCodes.OK,
			data: {
				...user,
				avatar: null,
			},
		});
	});

	test('should return an user with avatar', async () => {
		user = {
			...user,
			photo: 'photo.png',
		};

		const data = await controller(request);

		expect<ResponseModel<UserResult>>(data).toStrictEqual<
			ResponseModel<UserResult>
		>({
			status: StatusCodes.OK,
			data: {
				...user,
				avatar: 'avatar.png',
			},
		});
	});
});
