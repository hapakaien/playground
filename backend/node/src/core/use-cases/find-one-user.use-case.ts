import { getErrorMessage } from '../entities/validation.entity';
import { NotFoundException } from '../exceptions/not-found.exception';
import type { FileService } from '../interfaces/file.interface';
import type { UserRepository, UserResult } from '../interfaces/user.interface';

/**
 * Get one specific user.
 *
 * If the user is not found, a custom exception will be thrown.
 *
 * @param {string}         			 id             Validated id parameter
 * @param {UserRepository} 			 userRepository A repository of user
 * @param {FileService}    			 fileService    A service for file
 * @return {Promise<UserResult>}                An user entity
 */
export async function findOneUser(
	id: string,
	userRepository: UserRepository,
	fileService: FileService
): Promise<UserResult> {
	const record = await userRepository.findOne(id);

	if (!record) {
		throw new NotFoundException(getErrorMessage('user.exist'));
	}

	let avatar: string | null = null;
	if (record.photo) {
		avatar = await fileService.getUrl(record.photo);
	}

	return {
		...record,
		avatar,
	};
}
