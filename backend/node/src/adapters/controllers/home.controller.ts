import { StatusCodes } from 'http-status-codes';
import type { ResponseModel } from '../interfaces/common.interface';
import type { HttpRequest } from '../interfaces/http.interface';

export function homeController(_req: HttpRequest): ResponseModel<string> {
	return {
		status: StatusCodes.OK,
		data: 'Hello world!',
	};
}
