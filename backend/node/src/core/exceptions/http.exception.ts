import type { ErrorObject, HttpError } from '../interfaces/http.interface';

export class HttpException extends Error implements HttpError {
	readonly status: number;

	readonly statusCode: number;

	readonly error?: ErrorObject | Record<string, unknown>;

	constructor(status: number, message: string, name?: string) {
		super(message);
		this.status = status;
		this.statusCode = status;
		this.name = name || 'HTTP Error';
	}
}
