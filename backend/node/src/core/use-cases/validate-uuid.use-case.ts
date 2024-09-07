import { BadRequestException } from '../exceptions/bad-request.exception';

/**
 * Validate UUID v4
 *
 * @param {string} uuid UUID v4
 */
export function validateUuid(uuid: string): boolean {
	const regexExp =
		/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

	if (!regexExp.test(uuid)) {
		throw new BadRequestException('Validation failed (uuid v4 is expected).');
	}

	return true;
}
