import { BadRequestException } from '../../core/exceptions/bad-request.exception';
import { validateUuid } from '../../core/use-cases/validate-uuid.use-case';
import type { RequestIdParams } from '../interfaces/common.interface';
import type { HttpRequestParams } from '../interfaces/http.interface';

export function validateUuidController(
	req: HttpRequestParams<RequestIdParams>
): boolean {
	if (!req.params) {
		throw new BadRequestException('An id parameter is expexted.');
	}

	const { id } = req.params;

	return validateUuid(id);
}
