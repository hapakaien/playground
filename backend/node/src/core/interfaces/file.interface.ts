import type { File } from '../entities/common.entity';

export interface FileService {
	upload: (file?: File, originalName?: string | null) => Promise<string | null>;
	getUrl: (path: string) => Promise<string | null>;
	remove: (path: string) => Promise<void>;
}
