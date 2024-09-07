import Redis from 'ioredis';
import { redisConfig } from '../config/redis';

export const redis = new Redis(redisConfig);
