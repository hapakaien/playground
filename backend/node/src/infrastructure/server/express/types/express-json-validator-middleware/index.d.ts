import type { RequestHandler } from 'express';

declare module 'express-json-validator-middleware' {
	export class Validator {
		validate<Params = Record<string, unknown>, Body = Record<string, unknown>>(
			rules: List<ValidateFunction>
		): RequestHandler<Params, unknown, Body>;
	}
}
