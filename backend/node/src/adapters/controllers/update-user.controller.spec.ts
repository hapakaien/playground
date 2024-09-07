import { StatusCodes } from 'http-status-codes';
import { mockedUpdateUser } from '../../../__tests__/mocks/user.mock';
import { BadRequestException } from '../../core/exceptions/bad-request.exception';
import type { FileService } from '../../core/interfaces/file.interface';
import type {
	UpdateUserDto,
	UserRepository,
	UserResult,
	UserTable,
} from '../../core/interfaces/user.interface';
import { ResponseModel } from '../interfaces/common.interface';
import type { HttpRequest } from '../interfaces/http.interface';
import type { UserRequestParams } from '../interfaces/user.interface';
import { updateUserController } from './update-user.controller';

describe('updateUserController', () => {
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

	let dto: UpdateUserDto = {};

	let request: HttpRequest<
		unknown,
		UserRequestParams,
		Omit<UpdateUserDto, 'photo'>
	> = {
		body: dto,
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

	const controller = updateUserController(userRepository, fileService);

	beforeEach(() => {
		mockedUpdateUser.mockImplementation(() => {
			return Promise.resolve<UserResult>({
				...user,
				first_name: dto.first_name ?? user.first_name,
				last_name: dto.last_name ?? user.last_name,
				// nickname: dto.nickname ? dto.nickname : result.nickname,
				email: dto.email ? dto.email : user.email,
				avatar: user.photo ? 'avatar.png' : null,
			});
		});
	});

	test('should throw error when parameter is empty', async () => {
		await expect(controller(request)).rejects.toThrow(
			new BadRequestException('An id parameter is expected.')
		);
	});

	test('should not update user', async () => {
		request = { ...request, params: { id: 'id' } };

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

	test("should only update user's name", async () => {
		dto = {
			first_name: 'John',
			last_name: 'Doe',
		};

		const data = await controller(request);

		expect<ResponseModel<UserResult>>(data).toStrictEqual<
			ResponseModel<UserResult>
		>({
			status: StatusCodes.OK,
			data: {
				...user,
				first_name: 'John',
				last_name: 'Doe',
				avatar: null,
			},
		});
	});

	test("should only update user's email", async () => {
		dto = {
			email: 'janedoe@example.com',
		};
		const data = await controller(request);

		expect<ResponseModel<UserResult>>(data).toStrictEqual<
			ResponseModel<UserResult>
		>({
			status: StatusCodes.OK,
			data: {
				...user,
				email: 'janedoe@example.com',
				avatar: null,
			},
		});
	});

	test("should only update user's avatar", async () => {
		dto = {};
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
