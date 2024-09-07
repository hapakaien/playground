import { StatusCodes } from 'http-status-codes';
import { BadRequestException } from '../../core/exceptions/bad-request.exception';
import type { FileService } from '../../core/interfaces/file.interface';
import type { UserRepository } from '../../core/interfaces/user.interface';
import { removeUser } from '../../core/use-cases/remove-user.use-case';
import type { ResponseModel } from '../interfaces/common.interface';
import type { HttpRequestParams } from '../interfaces/http.interface';
import type { UserRequestParams } from '../interfaces/user.interface';

export function removeUserController(
	userRepository: UserRepository,
	fileService: FileService
): (req: HttpRequestParams<UserRequestParams>) => Promise<ResponseModel> {
	return async (
		req: HttpRequestParams<UserRequestParams>
	): Promise<ResponseModel> => {
		if (!req.params) {
			throw new BadRequestException('An id parameter is expected.');
		}

		const { id } = req.params;

		await removeUser(id, userRepository, fileService);

		return {
			status: StatusCodes.NO_CONTENT,
		};
	};
}
