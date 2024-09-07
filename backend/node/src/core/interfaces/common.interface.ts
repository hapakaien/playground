import { PaginationParams, PaginationResult } from './http.interface';

export interface BaseRepository<TableInput, Table> {
	create: (data: TableInput) => Promise<Table | null>;
	findAll: (options: PaginationParams) => Promise<PaginationResult<Table>>;
	findOne: (id: string) => Promise<Table | null>;
	update: (id: string, data: Partial<TableInput>) => Promise<Table | null>;
	remove: (id: string) => Promise<Table | null>;
	truncate: () => Promise<void>;
}
