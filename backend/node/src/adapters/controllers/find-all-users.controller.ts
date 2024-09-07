import { StatusCodes } from 'http-status-codes';
import type { FileService } from '../../core/interfaces/file.interface';
import type {
	UserRepository,
	UserResult,
} from '../../core/interfaces/user.interface';
import { findAllUsers } from '../../core/use-cases/find-all-users.use-case';
import type { ResponseModel } from '../interfaces/common.interface';
import type {
	HttpRequest,
	JsonApiPagination,
} from '../interfaces/http.interface';

export function findAllUsersController(
	userRepository: UserRepository,
	fileService: FileService
): (
	req: HttpRequest<unknown, JsonApiPagination>
) => Promise<ResponseModel<UserResult[]>> {
	return async (
		req: HttpRequest<unknown, JsonApiPagination>
	): Promise<ResponseModel<UserResult[]>> => {
		const { data, meta } = await findAllUsers(userRepository, fileService, {
			page: Number(req.params?.page.number),
			limit: Number(req.params?.page.size),
		});

		return {
			status: StatusCodes.OK,
			data,
			meta,
		};
	};
}
