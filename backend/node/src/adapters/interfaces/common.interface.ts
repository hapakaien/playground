import { PaginationResult } from '../../core/interfaces/http.interface';
import type { HttpRequest } from './http.interface';

export interface RequestIdParams {
	id: string;
}

export type Controller = (
	req: HttpRequest
) => ResponseModel<unknown> | Promise<ResponseModel<unknown>>;

export interface ResponseModel<Model = Record<string, unknown>> {
	status: number;
	data?: Model;
	meta?: PaginationResult['meta'];
	cookie?: {
		name: string;
		value: string;
		maxAge: number;
	};
}
