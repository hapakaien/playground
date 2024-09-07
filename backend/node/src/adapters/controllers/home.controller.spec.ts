import { StatusCodes } from 'http-status-codes';
import type { ResponseModel } from '../interfaces/common.interface';
import type { HttpRequest } from '../interfaces/http.interface';
import { homeController } from './home.controller';

describe('homeController', () => {
	const request: HttpRequest = {};

	test('should return hello world!', () => {
		const data = homeController(request);

		expect<ResponseModel<string>>(data).toStrictEqual<ResponseModel<string>>({
			status: StatusCodes.OK,
			data: 'Hello world!',
		});
	});
});
