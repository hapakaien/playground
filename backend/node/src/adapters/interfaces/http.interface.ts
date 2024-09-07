import { DataDocument, Dictionary, ErrorDocument, JapiError } from 'ts-japi';
import Resource from 'ts-japi/lib/models/resource.model';
import type { File } from '../../core/entities/common.entity';

export interface HttpRequest<
	Header = Record<string, unknown>,
	Params = Record<string, unknown>,
	Body = Record<string, unknown>,
	Cookie = Record<string, unknown>,
	User = Record<string, unknown>
> {
	headers?: Header;
	params?: Params;
	body?: Body;
	file?: File;
	user?: User;
	cookies?: Cookie;
}

export type HttpRequestParams<T = Record<string, unknown>> = HttpRequest<
	unknown,
	T
>;

export type HttpRequestBody<T = Record<string, unknown>> = HttpRequest<
	unknown,
	unknown,
	T
>;

export type HttpRequestCookie<T = Record<string, unknown>> = HttpRequest<
	unknown,
	unknown,
	unknown,
	T
>;

export interface JsonApiData<Entity extends Dictionary<any>>
	extends Omit<DataDocument<Entity>, 'data'> {
	data: Omit<Resource<Entity>, 'attributes'> & {
		attributes: Entity;
	};
}

export interface JsonApiError extends Omit<ErrorDocument, 'errors'> {
	errors: Omit<JapiError, 'stack'>[];
}

export interface JsonApiPagination {
	page: {
		number: number;
		size: number;
	};
}
