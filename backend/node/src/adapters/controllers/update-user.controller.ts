import { StatusCodes } from 'http-status-codes';
import { BadRequestException } from '../../core/exceptions/bad-request.exception';
import type { FileService } from '../../core/interfaces/file.interface';
import type {
	UpdateUserDto,
	UserRepository,
	UserResult,
} from '../../core/interfaces/user.interface';
import { updateUser } from '../../core/use-cases/update-user.use-case';
import type { ResponseModel } from '../interfaces/common.interface';
import type { HttpRequest } from '../interfaces/http.interface';
import type { UserRequestParams } from '../interfaces/user.interface';

export function updateUserController(
	userRepository: UserRepository,
	fileService: FileService
): (
	req: HttpRequest<unknown, UserRequestParams, Omit<UpdateUserDto, 'photo'>>
) => Promise<ResponseModel<UserResult>> {
	return async (
		req: HttpRequest<unknown, UserRequestParams, Omit<UpdateUserDto, 'photo'>>
	): Promise<ResponseModel<UserResult>> => {
		if (!req.params) {
			throw new BadRequestException('An id parameter is expected.');
		}

		const { id } = req.params;

		const dto = { ...req.body };

		const data = await updateUser(id, dto, userRepository, fileService);

		return {
			status: StatusCodes.OK,
			data,
		};
	};
}
