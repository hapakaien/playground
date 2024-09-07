import type { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { extname } from 'path';
import { DataDocument, Linker, Paginator, Serializer } from 'ts-japi';
import { createUserController } from '../../../../adapters/controllers/create-user.controller';
import { findAllUsersController } from '../../../../adapters/controllers/find-all-users.controller';
import { findOneUserController } from '../../../../adapters/controllers/find-one-user.controller';
import { removeUserController } from '../../../../adapters/controllers/remove-user.controller';
import { updateUserController } from '../../../../adapters/controllers/update-user.controller';
import type {
	HttpRequest,
	HttpRequestBody,
	JsonApiData,
	JsonApiPagination,
} from '../../../../adapters/interfaces/http.interface';
import type {
	CreateUser,
	UpdateUser,
	UserData,
	UserRequestParams,
} from '../../../../adapters/interfaces/user.interface';
import { appConfig } from '../../../config/app';
import { userRepository } from '../../../repositories/user.repository';
import { fileService } from '../../../services/file.service';

const userPath = `${appConfig.url}/users`;

const userSerializer = new Serializer<UserData>('users', {
	version: '1.1',
});
const UserLinker = new Linker<[UserData]>((users) => {
	return `${userPath}/${users.id}`;
});

export async function create(
	req: Request<unknown, unknown, JsonApiData<CreateUser>>,
	res: Response<Partial<DataDocument<UserData>>>
) {
	const request: HttpRequestBody<CreateUser> = {
		body: {
			...req.body.data.attributes,
			id: req.body.data.id,
		},
	};

	if (req.file) {
		const { filename, size, mimetype, path, originalname } = req.file;

		Object.assign<
			HttpRequestBody<CreateUser>,
			Partial<HttpRequestBody<CreateUser>>
		>(request, {
			file: {
				name: filename,
				size,
				type: mimetype,
				extension: extname(originalname),
				content: createReadStream(path),
			},
		});
	}

	const controller = createUserController(userRepository);
	const { status, data } = await controller(request);

	const result = await userSerializer.serialize(data, {
		linkers: {
			resource: UserLinker,
		},
	});

	res.status(status).contentType('application/vnd.api+json').json(result);
}

export async function findAll(
	req: Request<unknown, unknown, unknown, JsonApiPagination>,
	res: Response<Partial<DataDocument<UserData[]>>>
) {
	const controller = findAllUsersController(userRepository, fileService);
	const { status, data, meta } = await controller({
		params: req.query,
	});

	const UserPaginator = new Paginator<UserData>((_user) => {
		const {
			page: { size: limit, number: page },
		} = req.query;
		const totalPages = Math.ceil(Number(meta?.total) / limit);
		const prevPage = page > 1 ? page - 1 : 0;
		const nextPage = page < totalPages ? page + 1 : 0;

		return {
			first: `${userPath}/?page[number]=1&page[size]=${req.query.page.size}`,
			last: `${userPath}/?page[number]=${totalPages}&page[size]=${req.query.page.size}`,
			prev: prevPage
				? `${userPath}/?page[number]=${prevPage}&page[size]=${req.query.page.size}`
				: null,
			next: nextPage
				? `${userPath}/?page[number]=${nextPage}&page[size]=${req.query.page.size}`
				: null,
		};
	});

	const result = await userSerializer.serialize(data, {
		linkers: {
			resource: UserLinker,
			paginator: UserPaginator,
		},
	});

	res.status(status).contentType('application/vnd.api+json').json(result);
}

export async function findOne(
	req: Request<UserRequestParams>,
	res: Response<Partial<DataDocument<UserData>>>
) {
	const controller = findOneUserController(userRepository, fileService);

	const { status, data } = await controller({
		params: req.params,
	});

	const result = await userSerializer.serialize(data, {
		linkers: {
			resource: UserLinker,
		},
	});

	res.status(status).contentType('application/vnd.api+json').json(result);
}

export async function update(
	req: Request<UserRequestParams, unknown, JsonApiData<UpdateUser>>,
	res: Response<Partial<DataDocument<UserData>>>
) {
	const request: HttpRequest<unknown, UserRequestParams, UpdateUser> = {
		params: req.params,
		body: {
			...req.body.data.attributes,
			id: req.body.data.id,
		},
	};

	if (req.file) {
		const { filename, size, mimetype, path, originalname } = req.file;

		Object.assign<
			HttpRequest<unknown, UserRequestParams, UpdateUser>,
			Partial<HttpRequest<unknown, UserRequestParams, UpdateUser>>
		>(request, {
			file: {
				name: filename,
				size,
				type: mimetype,
				extension: extname(originalname),
				content: createReadStream(path),
			},
		});
	}

	const controller = updateUserController(userRepository, fileService);

	const { status, data } = await controller(request);

	const result = await userSerializer.serialize(data, {
		linkers: {
			resource: UserLinker,
		},
	});

	res.status(status).contentType('application/vnd.api+json').json(result);
}

export async function compatUpdate(
	req: Request<unknown, unknown, JsonApiData<CreateUser>>,
	res: Response<Partial<DataDocument<UserData>>>
) {
	const request: HttpRequest<unknown, UserRequestParams, UpdateUser> = {
		body: {
			...req.body.data.attributes,
			id: req.body.data.id,
		},
		params: {
			id: req.body.data.id,
		},
	};

	if (req.file) {
		const { filename, size, mimetype, path, originalname } = req.file;

		Object.assign<
			HttpRequest<unknown, UserRequestParams, UpdateUser>,
			Partial<HttpRequest<unknown, UserRequestParams, UpdateUser>>
		>(request, {
			file: {
				name: filename,
				size,
				type: mimetype,
				extension: extname(originalname),
				content: createReadStream(path),
			},
		});
	}

	const controller = updateUserController(userRepository, fileService);
	const { status, data } = await controller(request);

	const result = await userSerializer.serialize(data, {
		linkers: {
			resource: UserLinker,
		},
	});

	res.status(status).contentType('application/vnd.api+json').json(result);
}

export async function remove(req: Request<UserRequestParams>, res: Response) {
	const controller = removeUserController(userRepository, fileService);

	const { status } = await controller({
		params: req.params,
	});

	res.status(status).contentType('application/vnd.api+json').end();
}
