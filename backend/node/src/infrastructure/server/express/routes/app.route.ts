import { Router } from 'express';
import { readFileSync } from 'fs';
import { JsonObject, serve, setup } from 'swagger-ui-express';
import { parse } from 'yaml';
import { home } from '../handlers/app.handler';

const appRouter = Router();

const openapi = readFileSync('../../openapi.yaml', 'utf8');
const swaggerDoc = <JsonObject>parse(openapi);

appRouter.get('/', home);

appRouter.use('/doc', serve);
appRouter.get('/doc', setup(swaggerDoc));

export { appRouter };
