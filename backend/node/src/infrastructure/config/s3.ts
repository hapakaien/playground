import type { S3ClientConfig } from '@aws-sdk/client-s3';

export const s3Config: S3ClientConfig = {
	endpoint: {
		protocol: 'http',
		hostname: process.env.AWS_ENDPOINT || 'localhost',
		port: parseInt(String(process.env.AWS_PORT), 10) || 9000,
		path: '/',
	},
	region: process.env.AWS_DEFAULT_REGION || 'ap-southeast-1',
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'miniosudo',
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'miniosudo',
	},
	forcePathStyle: true,
};
