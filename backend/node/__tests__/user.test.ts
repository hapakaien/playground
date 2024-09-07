import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { DataDocument } from 'ts-japi';
import {
	JsonApiError,
	JsonApiPagination,
} from '../src/adapters/interfaces/http.interface';
import { UserData } from '../src/adapters/interfaces/user.interface';
import { getErrorMessage } from '../src/core/entities/validation.entity';
import { setup, testUser, user } from './fixtures/user.fixture';
import { SupertestResponse, request } from './setup';
import { close } from './teardown';

beforeEach(async () => {
	await setup();
});

afterAll(async () => {
	await close();
});

describe('POST /users', () => {
	test('should return error when request body empty', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.post('/users')
			.set('Accept', 'application/vnd.api+json');

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('data.required'),
				},
			],
		});
	});

	test('should return error when email is invalid', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.post('/users')
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					type: 'users',
					attributes: {
						first_name: user.first_name,
						last_name: user.last_name,
						email: 'johndoe',
					},
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('data.attributes.email.format'),
				},
			],
		});
	});

	test('should return error when email is already taken', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.post('/users')
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					type: 'users',
					attributes: {
						first_name: user.first_name,
						last_name: user.last_name,
						email: user.email,
					},
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('email.unique'),
				},
			],
		});
	});

	test('should create an user', async () => {
		const response: SupertestResponse<DataDocument<UserData>> = await request
			.post('/users')
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					type: 'users',
					attributes: {
						first_name: testUser.first_name,
						last_name: testUser.last_name,
						email: testUser.email,
					},
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.CREATED
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty(
			'jsonapi.version',
			'1.1'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.id'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.type',
			'users'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.first_name',
			testUser.first_name
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.last_name',
			String(testUser.last_name)
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.nickname'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.email',
			testUser.email
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<null>(
			'data.attributes.photo',
			null
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<null>(
			'data.attributes.avatar',
			null
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.created_at'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.updated_at'
		);
	});
});

describe('GET /users', () => {
	test('should return error when query parameter is empty', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.get('/users')
			.set('Accept', 'application/vnd.api+json');

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('page.required'),
				},
			],
		});
	});

	test('should return error when page query parameter is empty', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.get('/users')
			.query({
				page: null,
			})
			.set('Accept', 'application/vnd.api+json');

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('page.type'),
				},
			],
		});
	});

	test('should return error when page number query parameter is mising', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.get('/users')
			.query({
				page: {
					size: 10,
				},
			})
			.set('Accept', 'application/vnd.api+json');

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('page.number.required'),
				},
			],
		});
	});

	test('should return error when page size query parameter is mising', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.get('/users')
			.query({
				page: {
					number: 10,
				},
			})
			.set('Accept', 'application/vnd.api+json');

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('page.size.required'),
				},
			],
		});
	});

	test('should return error when page size & number query parameter is wrong type', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.get('/users')
			.query({
				page: {
					number: null,
					size: null,
				},
			})
			.set('Accept', 'application/vnd.api+json');

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('page.number.type'),
				},
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('page.size.type'),
				},
			],
		});
	});

	test('should return users', async () => {
		const params: JsonApiPagination = {
			page: {
				number: 1,
				size: 10,
			},
		};

		const response: SupertestResponse<DataDocument<UserData[]>> = await request
			.get('/users')
			.query(params)
			.set('Accept', 'application/vnd.api+json');

		expect<number>(response.status).toStrictEqual<StatusCodes>(StatusCodes.OK);
		expect<DataDocument<UserData[]>>(response.body).toHaveProperty<string>(
			'jsonapi.version',
			'1.1'
		);
		expect<DataDocument<UserData[]>>(response.body).toHaveProperty<string>(
			'data[0].type',
			'users'
		);
		expect<DataDocument<UserData[]>>(response.body).toHaveProperty<string>(
			'data[0].attributes.first_name',
			user.first_name
		);
		expect<DataDocument<UserData[]>>(response.body).toHaveProperty<string>(
			'data[0].attributes.last_name',
			String(user.last_name)
		);
		expect<DataDocument<UserData[]>>(response.body).toHaveProperty<string>(
			'data[0].attributes.nickname'
		);
		expect<DataDocument<UserData[]>>(response.body).toHaveProperty<string>(
			'data[0].attributes.email',
			user.email
		);
		expect<DataDocument<UserData[]>>(response.body).toHaveProperty<null>(
			'data[0].attributes.photo',
			null
		);
		expect<DataDocument<UserData[]>>(response.body).toHaveProperty<null>(
			'data[0].attributes.avatar',
			null
		);
		expect<DataDocument<UserData[]>>(response.body).toHaveProperty<string>(
			'data[0].attributes.created_at'
		);
		expect<DataDocument<UserData[]>>(response.body).toHaveProperty<string>(
			'data[0].attributes.updated_at'
		);
	});
});

describe('GET /users/{id}', () => {
	test('should return error when parameter is invalid', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.get('/users/invalid-id')
			.set('Accept', 'application/vnd.api+json');

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('id.format'),
				},
			],
		});
	});

	test('should return error when user is not found', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.get('/users/60677a98-a65e-4abc-831c-45dd76e8f990')
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
					detail: getErrorMessage('user.exist'),
				},
			],
		});
	});

	test('should return an user', async () => {
		const response: SupertestResponse<DataDocument<UserData>> = await request
			.get(`/users/${user.id}`)
			.set('Accept', 'application/vnd.api+json');

		expect<number>(response.status).toStrictEqual<StatusCodes>(StatusCodes.OK);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'jsonapi.version',
			'1.1'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.id',
			user.id
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.type',
			'users'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.first_name',
			user.first_name
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.last_name',
			String(user.last_name)
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.nickname'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.email',
			user.email
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<null>(
			'data.attributes.photo',
			null
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<null>(
			'data.attributes.avatar',
			null
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.created_at'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.updated_at'
		);
	});
});

describe('PATCH /users/{id}', () => {
	test('should return error when parameter is invalid', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.patch('/users/invalid-id')
			.set('Accept', 'application/vnd.api+json');

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('id.format'),
				},
			],
		});
	});

	test('should return error when user is not found', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.patch('/users/60677a98-a65e-4abc-831c-45dd76e8f990')
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					type: 'users',
				},
			});

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
					detail: getErrorMessage('user.exist'),
				},
			],
		});
	});

	test('should return error when name is null', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.patch(`/users/${user.id}`)
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					type: 'users',
					attributes: {
						first_name: null,
					},
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('data.attributes.first_name.type'),
				},
			],
		});
	});

	test('should return error when name is empty', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.patch(`/users/${user.id}`)
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					type: 'users',
					attributes: {
						first_name: '',
					},
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('data.attributes.first_name.minLength'),
				},
			],
		});
	});

	test('should return error when name is invalid', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.patch(`/users/${user.id}`)
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					type: 'users',
					attributes: {
						first_name: 12345,
					},
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('data.attributes.first_name.type'),
				},
			],
		});
	});

	test('should ok when username is null', async () => {
		const response: SupertestResponse<DataDocument<UserData>> = await request
			.patch(`/users/${user.id}`)
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					type: 'users',
					attributes: {
						nickname: null,
					},
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(StatusCodes.OK);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'jsonapi.version',
			'1.1'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.id',
			user.id
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.type',
			'users'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.first_name',
			user.first_name
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.last_name',
			String(user.last_name)
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<null>(
			'data.attributes.nickname',
			null
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.email',
			user.email
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<null>(
			'data.attributes.photo',
			null
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<null>(
			'data.attributes.avatar',
			null
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.created_at'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.updated_at'
		);
	});

	test('should ok when username is empty', async () => {
		const response: SupertestResponse<DataDocument<UserData>> = await request
			.patch(`/users/${user.id}`)
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					type: 'users',
					attributes: {
						nickname: '',
					},
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(StatusCodes.OK);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'jsonapi.version',
			'1.1'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.id',
			user.id
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.type',
			'users'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.first_name',
			user.first_name
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.last_name',
			String(user.last_name)
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<null>(
			'data.attributes.nickname',
			null
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.email',
			user.email
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<null>(
			'data.attributes.photo',
			null
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<null>(
			'data.attributes.avatar',
			null
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.created_at'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.updated_at'
		);
	});

	test('should return error when email is null', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.patch(`/users/${user.id}`)
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					type: 'users',
					attributes: {
						email: null,
					},
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('data.attributes.email.type'),
				},
			],
		});
	});

	test('should return error when email is empty', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.patch(`/users/${user.id}`)
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					type: 'users',
					attributes: {
						email: '',
					},
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('data.attributes.email.format'),
				},
			],
		});
	});

	test('should return error when email is invalid', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.patch(`/users/${user.id}`)
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					type: 'users',
					attributes: {
						email: 12345,
					},
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('data.attributes.email.type'),
				},
			],
		});
	});

	test('should return error when email is invalid', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.patch(`/users/${user.id}`)
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					type: 'users',
					attributes: {
						email: 'johndoe',
					},
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('data.attributes.email.format'),
				},
			],
		});
	});

	test('should not update an user', async () => {
		const response: SupertestResponse<DataDocument<UserData>> = await request
			.patch(`/users/${user.id}`)
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					type: 'users',
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(StatusCodes.OK);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'jsonapi.version',
			'1.1'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.id',
			user.id
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.type',
			'users'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.first_name',
			user.first_name
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.last_name',
			String(user.last_name)
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.nickname'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.email',
			user.email
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<null>(
			'data.attributes.photo',
			null
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<null>(
			'data.attributes.avatar',
			null
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.created_at'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.updated_at'
		);
	});
});

describe('PUT /users', () => {
	test('should return error when request body is empty', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.put('/users')
			.set('Accept', 'application/vnd.api+json');

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('data.required'),
				},
			],
		});
	});

	test('should return error when data is empty object', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.put('/users')
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('data.type.required'),
				},
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('data.id.required'),
				},
			],
		});
	});

	test('should return error when data.type is invalid', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.put('/users')
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					type: 'user',
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('data.type.pattern'),
				},
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('data.id.required'),
				},
			],
		});
	});

	test('should return error when data.attributes.id is missing', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.put('/users')
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					type: 'users',
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('data.id.required'),
				},
			],
		});
	});

	test('should not update user', async () => {
		const response: SupertestResponse<DataDocument<UserData>> = await request
			.put('/users')
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					id: user.id,
					type: 'users',
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(StatusCodes.OK);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'jsonapi.version',
			'1.1'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.id',
			user.id
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.type',
			'users'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.first_name',
			user.first_name
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.last_name',
			String(user.last_name)
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.nickname'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.email',
			user.email
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<null>(
			'data.attributes.photo',
			null
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<null>(
			'data.attributes.avatar',
			null
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.created_at'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.updated_at'
		);
	});

	test('should return error when name is null', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.put(`/users`)
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					type: 'users',
					id: user.id,
					attributes: {
						first_name: null,
					},
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('data.attributes.first_name.type'),
				},
			],
		});
	});

	test('should return error when name is null', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.put(`/users`)
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					id: user.id,
					type: 'users',
					attributes: {
						first_name: null,
					},
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('data.attributes.first_name.type'),
				},
			],
		});
	});

	test('should return error when name is empty', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.put(`/users`)
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					id: user.id,
					type: 'users',
					attributes: {
						first_name: '',
					},
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('data.attributes.first_name.minLength'),
				},
			],
		});
	});

	test('should return error when name is invalid', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.put(`/users`)
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					id: user.id,
					type: 'users',
					attributes: {
						first_name: 12345,
					},
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('data.attributes.first_name.type'),
				},
			],
		});
	});

	test('should ok when username is null', async () => {
		const response: SupertestResponse<DataDocument<UserData>> = await request
			.put(`/users`)
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					id: user.id,
					type: 'users',
					attributes: {
						nickname: null,
					},
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(StatusCodes.OK);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'jsonapi.version',
			'1.1'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.id',
			user.id
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.type',
			'users'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.first_name',
			user.first_name
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.last_name',
			String(user.last_name)
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<null>(
			'data.attributes.nickname',
			null
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.email',
			user.email
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<null>(
			'data.attributes.photo',
			null
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<null>(
			'data.attributes.avatar',
			null
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.created_at'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.updated_at'
		);
	});

	test('should ok when username is empty', async () => {
		const response: SupertestResponse<DataDocument<UserData>> = await request
			.put(`/users`)
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					id: user.id,
					type: 'users',
					attributes: {
						nickname: '',
					},
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(StatusCodes.OK);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'jsonapi.version',
			'1.1'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.id',
			user.id
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.type',
			'users'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.first_name',
			user.first_name
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.last_name',
			String(user.last_name)
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<null>(
			'data.attributes.nickname',
			null
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.email',
			user.email
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<null>(
			'data.attributes.photo',
			null
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<null>(
			'data.attributes.avatar',
			null
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.created_at'
		);
		expect<DataDocument<UserData>>(response.body).toHaveProperty<string>(
			'data.attributes.updated_at'
		);
	});

	test('should return error when email is null', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.put(`/users`)
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					id: user.id,
					type: 'users',
					attributes: {
						email: null,
					},
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('data.attributes.email.type'),
				},
			],
		});
	});

	test('should return error when email is empty', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.put(`/users`)
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					id: user.id,
					type: 'users',
					attributes: {
						email: '',
					},
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('data.attributes.email.format'),
				},
			],
		});
	});

	test('should return error when email is invalid', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.put(`/users`)
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					id: user.id,
					type: 'users',
					attributes: {
						email: 12345,
					},
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('data.attributes.email.type'),
				},
			],
		});
	});

	test('should return error when email is invalid', async () => {
		const response: SupertestResponse<JsonApiError> = await request
			.put(`/users`)
			.set('Accept', 'application/vnd.api+json')
			.send({
				data: {
					id: user.id,
					type: 'users',
					attributes: {
						email: 'johndoe',
					},
				},
			});

		expect<number>(response.status).toStrictEqual<StatusCodes>(
			StatusCodes.BAD_REQUEST
		);
		expect<JsonApiError>(response.body).toStrictEqual<JsonApiError>({
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: StatusCodes.BAD_REQUEST.toString(),
					title: ReasonPhrases.BAD_REQUEST,
					detail: getErrorMessage('data.attributes.email.format'),
				},
			],
		});
	});
});
