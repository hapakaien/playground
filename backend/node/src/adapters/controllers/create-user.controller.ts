import { StatusCodes } from 'http-status-codes';
import { BadRequestException } from '../../core/exceptions/bad-request.exception';
import type {
	CreateUserDto,
	UserRepository,
	UserResult,
} from '../../core/interfaces/user.interface';
import { createUser } from '../../core/use-cases/create-user.use-case';
import type { ResponseModel } from '../interfaces/common.interface';
import type { HttpRequestBody } from '../interfaces/http.interface';

export function createUserController(
	userRepository: UserRepository
): (
	req: HttpRequestBody<Omit<CreateUserDto, 'photo'>>
) => Promise<ResponseModel<UserResult>> {
	return async (
		req: HttpRequestBody<Omit<CreateUserDto, 'photo'>>
	): Promise<ResponseModel<UserResult>> => {
		if (!req.body) {
			throw new BadRequestException('Request body is empty.');
		}

		const dto = {
			...req.body,
			photo: req.file,
		};

		const data = await createUser(dto, userRepository);

		return {
			status: StatusCodes.CREATED,
			data,
		};
	};
}
