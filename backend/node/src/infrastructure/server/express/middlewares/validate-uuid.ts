import type { NextFunction, Request, Response } from 'express';
import { validateUuidController } from '../../../../adapters/controllers/validate-uuid.controller';
import type { RequestIdParams } from '../../../../adapters/interfaces/common.interface';
import type { HttpRequestParams } from '../../../../adapters/interfaces/http.interface';

export function validateUuid() {
	return (
		req: Request<RequestIdParams>,
		_res: Response,
		next: NextFunction
	) => {
		const httpRequest: HttpRequestParams<RequestIdParams> = {
			params: {
				id: req.params.id,
			},
		};

		validateUuidController(httpRequest);

		next();
	};
}
