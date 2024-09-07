import type { AllowedSchema } from 'express-json-validator-middleware';
import { getErrorMessage } from '../../../../core/entities/validation.entity';

export const idParamSchema: AllowedSchema = {
	type: 'object',
	properties: {
		id: {
			type: 'string',
			format: 'uuid',
			errorMessage: {
				format: getErrorMessage('id.format'),
			},
		},
	},
	required: ['id'],
	errorMessage: {
		required: {
			id: getErrorMessage('id.required'),
		},
	},
};
