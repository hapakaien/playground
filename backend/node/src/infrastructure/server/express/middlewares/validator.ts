import ajvErrors from 'ajv-errors';
import addFormats from 'ajv-formats';
import type {
	AllowedSchema,
	OptionKey,
} from 'express-json-validator-middleware';
import { Validator } from 'express-json-validator-middleware';

const validator = new Validator({
	allErrors: true,
	$data: true,
	removeAdditional: true,
});

const { ajv } = validator;

addFormats(ajv, ['email', 'uuid']);

ajvErrors(ajv);

export function validate(schema: AllowedSchema, key: OptionKey = 'body') {
	switch (key) {
		case 'params':
			return validator.validate({
				params: schema,
			});
		case 'query':
			return validator.validate({
				query: schema,
			});
		case 'body':
			return validator.validate({
				body: schema,
			});
		default:
			return validator.validate({
				body: schema,
			});
	}
}
