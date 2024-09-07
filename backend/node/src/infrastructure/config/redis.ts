import type { RedisOptions } from 'ioredis';

export const redisConfig: RedisOptions = {
	host: process.env.REDIS_HOST || '127.0.0.1',
	port: parseInt(String(process.env.REDIS_PORT), 10) || 6379,
	db: 1,
};
