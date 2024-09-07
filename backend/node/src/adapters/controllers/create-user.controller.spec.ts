import { StatusCodes } from 'http-status-codes';
import { mockedCreateUser } from '../../../__tests__/mocks/user.mock';
import { BadRequestException } from '../../core/exceptions/bad-request.exception';
import type {
	CreateUserDto,
	UserRepository,
	UserResult,
	UserTable,
} from '../../core/interfaces/user.interface';
import type { ResponseModel } from '../interfaces/common.interface';
import type { HttpRequestBody } from '../interfaces/http.interface';
import { createUserController } from './create-user.controller';

describe('createUserController', () => {
	const userRepository: UserRepository = {
		create: jest.fn(),
		findAll: jest.fn(),
		findOne: jest.fn(),
		findOneByEmail: jest.fn(),
		update: jest.fn(),
		remove: jest.fn(),
		truncate: jest.fn(),
	};

	const dto: CreateUserDto = {
		id: 'id',
		first_name: 'John',
		last_name: 'Doe',
		email: 'johndoe@example.com',
	};

	const controller = createUserController(userRepository);

	let request: HttpRequestBody<CreateUserDto> = {};

	const user: UserTable = {
		id: 'id',
		first_name: dto.first_name,
		last_name: dto.last_name,
		nickname: null,
		email: dto.email,
		created_at: '2022-06-11 01:55:13',
		updated_at: '2022-06-11 01:55:13',
	};

	beforeEach(() => {
		mockedCreateUser.mockImplementation(() => {
			return Promise.resolve<UserResult>({
				...user,
				first_name: dto.first_name,
				last_name: dto.last_name,
				email: dto.email,
				photo: null,
				avatar: null,
			});
		});
	});

	test('should throw error when request body is empty', async () => {
		await expect(controller(request)).rejects.toThrow(
			new BadRequestException('Request body is empty.')
		);
	});

	test('should create an user', async () => {
		request = {
			...request,
			body: dto,
		};

		const data = await controller(request);

		expect<ResponseModel<UserResult>>(data).toStrictEqual({
			status: StatusCodes.CREATED,
			data: {
				...user,
				photo: null,
				avatar: null,
			},
		});
	});
});
