import { getErrorMessage } from '../../core/entities/validation.entity';
import { BadRequestException } from '../../core/exceptions/bad-request.exception';
import type { RequestIdParams } from '../interfaces/common.interface';
import type { HttpRequestParams } from '../interfaces/http.interface';
import { validateUuidController } from './validate-uuid.controller';

describe('validateUuidController', () => {
	let request: HttpRequestParams<RequestIdParams> = {};

	test('should throw error when request params is empty', () => {
		expect(() => {
			validateUuidController(request);
		}).toThrow(new BadRequestException('An id parameter is expexted.'));
	});

	test('should throw error when id is invalid uuid', () => {
		request = {
			...request,
			params: {
				id: 'id',
			},
		};

		expect(() => {
			validateUuidController(request);
		}).toThrow(new BadRequestException(getErrorMessage('id.format')));
	});

	test('should return true when id is valid uuid', () => {
		request = {
			...request,
			params: {
				id: 'a2e4b207-be4d-45ab-81a1-bcdf565cc9be',
			},
		};

		const data = validateUuidController(request);

		expect<boolean>(data).toStrictEqual<boolean>(true);
	});
});
