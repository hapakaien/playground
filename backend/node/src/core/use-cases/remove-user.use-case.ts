import { getErrorMessage } from '../entities/validation.entity';
import { NotFoundException } from '../exceptions/not-found.exception';
import type { FileService } from '../interfaces/file.interface';
import type { UserRepository } from '../interfaces/user.interface';

/**
 * Delete an user.
 *
 * If the user is not found, a custom exception will be thrown.
 *
 * @param {string}          id             A validated id parameter
 * @param {UserRepository}  userRepository A repository of user
 * @param {FileService}     fileService    A service for manage file
 * @return {Promise<void>}                 Successfully remove user
 */
export async function removeUser(
	id: string,
	userRepository: UserRepository,
	fileService: FileService
): Promise<void> {
	const record = await userRepository.remove(id);

	if (!record) {
		throw new NotFoundException(getErrorMessage('user.exist'));
	}

	if (record.photo) {
		await fileService.remove(record.photo);
	}
}
