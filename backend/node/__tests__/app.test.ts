import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { JsonApiError } from '../src/adapters/interfaces/http.interface';
import { SupertestResponse, request } from './setup';
import { close } from './teardown';

afterAll(async () => {
	await close();
});

describe('GET /', () => {
	test('should return hello world', async () => {
		const response: SupertestResponse<string> = await request
			.get('/')
			.set('Accept', 'application/vnd.api+json');

		expect<number>(response.status).toStrictEqual<StatusCodes>(StatusCodes.OK);
		expect<string>(response.body).toStrictEqual<string>('Hello world!');
	});
});

describe('GET /404', () => {
	test('should return not found error', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.get('/404')
			.set('Accept', 'application/vnd.api+json');

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.NOT_FOUND
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.NOT_FOUND.toString(),
					title: ReasonPhrases.NOT_FOUND,
					detail: 'Resource not found.',
				},
			],
		});
	});
});
