import type { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { uniqueUserEmailController } from '../../../../adapters/controllers/unique-user-email.controller';
import type {
	HttpRequest,
	JsonApiData,
} from '../../../../adapters/interfaces/http.interface';
import type {
	UpdateUserDto,
	UserTable,
} from '../../../../core/interfaces/user.interface';
import { userRepository } from '../../../repositories/user.repository';

export function uniqueUserEmail() {
	return expressAsyncHandler(
		async (
			req: Request<
				Pick<UserTable, 'id'>,
				unknown,
				JsonApiData<Pick<UpdateUserDto, 'email' | 'id'>>
			>,
			_res: Response,
			next: NextFunction
		) => {
			if (!req.params?.id && req.body.data?.id) {
				Object.assign(req.params, {
					id: req.body.data.id,
				});
			}

			const httpRequest: HttpRequest<
				unknown,
				Pick<UserTable, 'id'>,
				Pick<UpdateUserDto, 'email'>
			> = {
				body: req.body.data.attributes,
				params: req.params,
			};

			const controller = uniqueUserEmailController(userRepository);

			await controller(httpRequest);

			next();
		}
	);
}
