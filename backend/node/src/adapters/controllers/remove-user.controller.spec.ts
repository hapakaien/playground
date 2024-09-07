import { StatusCodes } from 'http-status-codes';
import { mockedRemoveUser } from '../../../__tests__/mocks/user.mock';
import { BadRequestException } from '../../core/exceptions/bad-request.exception';
import type { FileService } from '../../core/interfaces/file.interface';
import type { UserRepository } from '../../core/interfaces/user.interface';
import { removeUser } from '../../core/use-cases/remove-user.use-case';
import type { ResponseModel } from '../interfaces/common.interface';
import type { HttpRequestParams } from '../interfaces/http.interface';
import type { UserRequestParams } from '../interfaces/user.interface';
import { removeUserController } from './remove-user.controller';

describe('removeUserController', () => {
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

	let request: HttpRequestParams<UserRequestParams> = {};

	const controller = removeUserController(userRepository, fileService);

	beforeAll(() => {
		mockedRemoveUser.mockReturnValue(Promise.resolve());
	});

	test('should throw error when parameter is empty', async () => {
		await expect(controller(request)).rejects.toThrow(
			new BadRequestException('An id parameter is expected.')
		);
	});

	test('should remove an user', async () => {
		mockedRemoveUser.mockReturnValue(Promise.resolve());

		request = {
			...request,
			params: {
				id: 'id',
			},
		};

		const data = await controller(request);

		expect<typeof removeUser>(removeUser).toHaveBeenCalledTimes(1);
		expect<typeof removeUser>(removeUser).toHaveBeenCalledWith<
			[string, UserRepository, FileService]
		>('id', userRepository, fileService);
		expect<ResponseModel>(data).toStrictEqual({
			status: StatusCodes.NO_CONTENT,
		});
	});
});
