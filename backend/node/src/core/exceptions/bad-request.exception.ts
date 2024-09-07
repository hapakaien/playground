import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import type { ErrorObject } from '../interfaces/http.interface';
import { HttpException } from './http.exception';

export class BadRequestException extends HttpException {
	declare readonly error?: ErrorObject | Record<string, unknown>;

	constructor(message: string, error?: ErrorObject) {
		super(StatusCodes.BAD_REQUEST, message, ReasonPhrases.BAD_REQUEST);

		if (error && Object.keys(error).length) {
			this.error = error;
		}
	}
}
