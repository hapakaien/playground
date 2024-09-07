import { db } from '../src/infrastructure/ports/database';
import { redis } from '../src/infrastructure/ports/redis';
import { s3 } from '../src/infrastructure/ports/s3';

export async function close() {
	await redis.quit();
	redis.disconnect();

	await db.destroy();

	s3.destroy();
}
