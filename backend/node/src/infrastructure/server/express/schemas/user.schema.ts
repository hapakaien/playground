import type { AllowedSchema } from 'express-json-validator-middleware';
import { getErrorMessage } from '../../../../core/entities/validation.entity';

export const findAllUserSchema: AllowedSchema = {
	type: 'object',
	properties: {
		page: {
			type: 'object',
			properties: {
				number: {
					type: 'integer',
					errorMessage: {
						type: getErrorMessage('page.number.type'),
					},
				},
				size: {
					type: 'integer',
					errorMessage: {
						type: getErrorMessage('page.size.type'),
					},
				},
			},
			required: ['number', 'size'],
			errorMessage: {
				required: {
					number: getErrorMessage('page.number.required'),
					size: getErrorMessage('page.size.required'),
				},
				type: getErrorMessage('page.type'),
			},
		},
	},
	required: ['page'],
	errorMessage: {
		required: {
			page: getErrorMessage('page.required'),
		},
	},
};

export const createUserSchema: AllowedSchema = {
	type: 'object',
	properties: {
		jsonapi: {
			type: 'object',
			properties: {
				version: {
					type: 'string',
					errorMessage: {
						type: getErrorMessage('jsonapi.version.type'),
					},
				},
			},
			required: ['version'],
			errorMessage: {
				required: {
					version: getErrorMessage('jsonapi.version.required'),
				},
			},
		},
		data: {
			type: 'object',
			properties: {
				id: {
					type: 'string',
					format: 'uuid',
					errorMessage: {
						format: getErrorMessage('data.id.format'),
					},
				},
				type: {
					type: 'string',
					pattern: 'users',
					errorMessage: {
						pattern: getErrorMessage('data.type.pattern'),
					},
				},
				attributes: {
					type: 'object',
					properties: {
						first_name: {
							type: 'string',
							minLength: 1,
						},
						last_name: {
							type: 'string',
							minLength: 1,
						},
						email: {
							type: 'string',
							minLength: 1,
							format: 'email',
							errorMessage: {
								minLength: getErrorMessage('data.attributes.email.minLength'),
								format: getErrorMessage('data.attributes.email.format'),
							},
						},
					},
					required: ['first_name', 'email'],
					errorMessage: {
						required: {
							first_name: getErrorMessage(
								'data.attributes.first_name.required'
							),
							email: getErrorMessage('data.attributes.email.required'),
						},
					},
				},
			},
			required: ['type'],
			errorMessage: {
				required: {
					type: getErrorMessage('data.type.required'),
				},
			},
		},
		links: {
			type: 'object',
			properties: {
				self: {
					type: 'string',
					errorMessage: {
						type: getErrorMessage('links.self.type'),
					},
				},
			},
			required: ['self'],
			errorMessage: {
				required: {
					self: getErrorMessage('links.self.required'),
				},
			},
		},
	},
	required: ['data'],
	errorMessage: {
		required: {
			data: getErrorMessage('data.required'),
		},
	},
};

export const updateUserSchema: AllowedSchema = {
	type: 'object',
	properties: {
		jsonapi: {
			type: 'object',
			properties: {
				version: {
					type: 'string',
					errorMessage: {
						type: getErrorMessage('jsonapi.version.type'),
					},
				},
			},
			required: ['version'],
			errorMessage: {
				required: {
					version: getErrorMessage('jsonapi.version.required'),
				},
			},
		},
		data: {
			type: 'object',
			properties: {
				id: {
					type: 'string',
					format: 'uuid',
					errorMessage: {
						format: getErrorMessage('data.id.format'),
					},
				},
				type: {
					type: 'string',
					pattern: 'users',
					errorMessage: {
						pattern: getErrorMessage('data.type.pattern'),
					},
				},
				attributes: {
					type: 'object',
					properties: {
						first_name: {
							type: 'string',
							minLength: 1,
							errorMessage: {
								type: getErrorMessage('data.attributes.first_name.type'),
								minLength: getErrorMessage(
									'data.attributes.first_name.minLength'
								),
							},
						},
						last_name: {
							type: 'string',
							nullable: true,
						},
						nickname: {
							type: 'string',
							nullable: true,
						},
						email: {
							type: 'string',
							format: 'email',
							errorMessage: {
								type: getErrorMessage('data.attributes.email.type'),
								format: getErrorMessage('data.attributes.email.format'),
							},
						},
					},
				},
			},
			required: ['type'],
			errorMessage: {
				required: {
					type: getErrorMessage('data.type.required'),
				},
			},
		},
		links: {
			type: 'object',
			properties: {
				self: {
					type: 'string',
					errorMessage: {
						type: getErrorMessage('links.self.type'),
					},
				},
			},
			required: ['self'],
			errorMessage: {
				required: {
					self: getErrorMessage('links.self.required'),
				},
			},
		},
	},
	required: ['data'],
	dependencies: {},
	errorMessage: {
		required: {
			data: getErrorMessage('data.required'),
		},
		dependencies: {},
	},
};

const copiedUpdateUserSchema = structuredClone(updateUserSchema);
export const compatUpdateUserSchema: AllowedSchema = {
	...copiedUpdateUserSchema,
	properties: {
		...copiedUpdateUserSchema.properties,
		data: {
			...copiedUpdateUserSchema.properties?.data,
			required: [
				...(copiedUpdateUserSchema.properties?.data?.required as string[]),
				'id',
			],
			errorMessage: {
				required: {
					type: getErrorMessage('data.type.required'),
					id: getErrorMessage('data.id.required'),
				},
			},
		},
	},
};
