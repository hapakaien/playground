import { BadRequestException } from '../../core/exceptions/bad-request.exception';
import type {
	UpdateUserDto,
	UserRepository,
	UserTable,
} from '../../core/interfaces/user.interface';
import { uniqueUserEmail } from '../../core/use-cases/unique-user-email.use-case';
import type { HttpRequestBody } from '../interfaces/http.interface';
import { uniqueUserEmailController } from './unique-user-email.controller';

jest.mock('../../core/use-cases/unique-user-email.use-case');

describe('uniqueUserEmailController', () => {
	const userRepository: UserRepository = {
		create: jest.fn(),
		findAll: jest.fn(),
		findOne: jest.fn(),
		findOneByEmail: jest.fn(),
		update: jest.fn(),
		remove: jest.fn(),
		truncate: jest.fn(),
	};

	let dto: Pick<UpdateUserDto, 'email'> = { email: 'johndoe@example.com' };

	const user: UserTable = {
		id: 'id',
		name: 'John Doe',
		nickname: null,
		email: 'johndoe@example.com',
		email_verified_at: null,
		password: 'abogoboga',
		created_at: '2022-06-11 01:55:13',
		updated_at: '2022-06-11 01:55:13',
	};

	let request: HttpRequestBody<Pick<UpdateUserDto, 'email'>> = {};

	const controller = uniqueUserEmailController(userRepository);

	const mockedUniqueUserEmail = jest.mocked(uniqueUserEmail, true);

	beforeEach(() => {
		mockedUniqueUserEmail.mockImplementation((email: string) => {
			if (email === user.email) {
				throw new BadRequestException('The email has already been taken.');
			}

			return Promise.resolve(true);
		});
	});

	test('should only check when email is provided', async () => {
		const data = await controller(request);

		expect(data).toEqual(true);
	});

	test('should throw error when email is not unique', async () => {
		request = { ...request, body: dto };

		await expect(controller(request)).rejects.toThrow(
			new BadRequestException('The email has already been taken.')
		);
	});

	test('should return true when email is unique', async () => {
		dto = { ...dto, email: 'jandoe@example.com' };
		request = { ...request, body: dto };

		const data = await controller(request);

		expect(data).toEqual(true);
	});
});
