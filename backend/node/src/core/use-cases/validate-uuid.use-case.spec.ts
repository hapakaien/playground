import { BadRequestException } from '../exceptions/bad-request.exception';
import { validateUuid } from './validate-uuid.use-case';

describe('validateUuid', () => {
	const uuid = '08f08814-b22f-42ab-b264-27030fa1adc9';

	test('should throw error if uuid is invalid', () => {
		expect(() => {
			validateUuid('invalid-uuid');
		}).toThrow(
			new BadRequestException('Validation failed (uuid v4 is expected).')
		);
	});

	test('should return true if uuid is valid', () => {
		expect<ReturnType<typeof validateUuid>>(
			validateUuid(uuid)
		).toStrictEqual<boolean>(true);
	});
});
