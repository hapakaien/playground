import type { ErrorObject } from 'ajv';
import type { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-json-validator-middleware';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import type { JsonApiError } from '../../../../adapters/interfaces/http.interface';
import { NotFoundException } from '../../../../core/exceptions/not-found.exception';
import type { HttpError } from '../../../../core/interfaces/http.interface';

export function notFoundHandler() {
	return (_req: Request, _res: Response, next: NextFunction) => {
		next(new NotFoundException('Resource not found.'));
	};
}

function createErrorArray(arr: ErrorObject[]): JsonApiError['errors'] {
	return arr
		.filter((item) => item.keyword !== 'if')
		.map<JsonApiError['errors'][number]>((item) => {
			return {
				status: StatusCodes.BAD_REQUEST.toString(),
				title: ReasonPhrases.BAD_REQUEST,
				detail: item.message as string,
			};
		});
}

export function errorHandler() {
	return (
		err: HttpError,
		_req: Request,
		res: Response,
		_next: NextFunction
	) => {
		const { name, message } = err;
		let { status } = err;

		let response: JsonApiError = {
			jsonapi: {
				version: '1.1',
			},
			errors: [
				{
					status: status?.toString(),
					title: name,
					detail: message,
				},
			],
		};

		if (err instanceof ValidationError) {
			if (err.validationErrors.params) {
				response = {
					...response,
					errors: createErrorArray(err.validationErrors.params),
				};
			} else if (err.validationErrors.query) {
				response = {
					...response,
					errors: createErrorArray(err.validationErrors.query),
				};
			} else if (err.validationErrors.body) {
				response = {
					...response,
					errors: createErrorArray(err.validationErrors.body),
				};
			}

			status = 400;
		}

		res.status(status || 500).json(response);
	};
}
