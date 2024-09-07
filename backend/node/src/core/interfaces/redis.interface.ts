export interface RedisService {
	set: (key: string, data: string, ttl?: number) => Promise<void>;
	get: (key: string) => Promise<string | null>;
	del: (key: string) => Promise<void>;
}
