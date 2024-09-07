import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { HttpException } from './http.exception';

export class NotFoundException extends HttpException {
	constructor(message: string) {
		super(StatusCodes.NOT_FOUND, message, ReasonPhrases.NOT_FOUND);
	}
}
