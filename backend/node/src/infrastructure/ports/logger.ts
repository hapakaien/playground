import ecsFormat from '@elastic/ecs-winston-format';
import { createLogger, transports } from 'winston';

const level = () => {
	return process.env.NODE_ENV === 'production' ? 'warn' : 'debug';
};

export const log = createLogger({
	levels: {
		error: 0,
		warn: 1,
		info: 2,
		http: 3,
		debug: 4,
	},
	level: level(),
	format: ecsFormat({ convertReqRes: true }),
	transports: [
		new transports.Console({
			silent: process.env.NODE_ENV === 'testing',
		}),
		new transports.File({ filename: './logs/error.json', level: 'error' }),
		new transports.File({ filename: './logs/all.json' }),
	],
});
