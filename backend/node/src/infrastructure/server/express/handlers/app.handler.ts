import type { Request, Response } from 'express';
import { homeController } from '../../../../adapters/controllers/home.controller';

export function home(_req: Request, res: Response) {
	const { status, data } = homeController({});

	res.status(status).json(data);
}
