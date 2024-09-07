import type { NextFunction, Request, Response } from 'express';
import type { HttpError } from '../../../../core/interfaces/http.interface';
import { log } from '../../../ports/logger';

export function httpLogger() {
	return (req: Request, res: Response, next: NextFunction) => {
		log.http('HTTP log', {
			req,
			res,
		});

		next();
	};
}

export function errorLogger() {
	return (
		err: HttpError,
		_req: Request,
		_res: Response,
		next: NextFunction
	) => {
		log.error('Error log:', {
			err,
		});

		next(err);
	};
}
