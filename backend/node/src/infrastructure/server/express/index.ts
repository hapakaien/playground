import { appConfig } from '../../config/app';
import { log } from '../../ports/logger';
import { app } from './app';

app.listen(appConfig.port, () => {
	log.info(`Server up and running at http://localhost:${appConfig.port}`);
});
