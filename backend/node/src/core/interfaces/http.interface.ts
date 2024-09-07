export interface ErrorObject {
	message: string;
}

export interface HttpError extends Error {
	status: number;
	statusCode: number;
	error?: ErrorObject | Record<string, unknown>;
}

export interface PaginationParams {
	page: number;
	limit: number;
}

export interface PaginationResult<Entity = Record<string, unknown>> {
	data: Entity[];
	meta: PaginationParams & {
		total: number;
	};
}
