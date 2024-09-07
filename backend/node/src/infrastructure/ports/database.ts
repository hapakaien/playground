import knex from 'knex';
import { databaseConfig } from '../config/database';

export const db = knex(databaseConfig);
