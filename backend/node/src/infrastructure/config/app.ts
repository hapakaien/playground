interface AppConfig {
	name: string;
	host: string;
	port: number;
	url: string;
}

export const appConfig: AppConfig = {
	name: process.env.APP_NAME || 'playground',
	host: process.env.APP_HOST || 'localhost',
	port: parseInt(String(process.env.APP_PORT), 10) || 3000,
	url: process.env.APP_URL || 'http://localhost:3000',
};
