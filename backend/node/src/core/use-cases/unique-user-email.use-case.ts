import { getErrorMessage } from '../entities/validation.entity';
import { BadRequestException } from '../exceptions/bad-request.exception';
import type { UserRepository } from '../interfaces/user.interface';

export async function uniqueUserEmail(
	userRepository: UserRepository,
	email: string,
	userId?: string
) {
	const isExists = await userRepository.findOneByEmail(email, userId);

	if (isExists) {
		throw new BadRequestException(getErrorMessage('email.unique'));
	}

	return true;
}
