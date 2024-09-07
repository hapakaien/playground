import { getErrorMessage } from '../entities/validation.entity';
import { NotFoundException } from '../exceptions/not-found.exception';
import type { FileService } from '../interfaces/file.interface';
import type {
	UpdateUserDto,
	UserRepository,
	UserResult,
	UserTableInput,
} from '../interfaces/user.interface';

/**
 * Update an user.
 *
 * If the user is not found, a custom exception will be thrown.
 *
 * @param {string}         			id             	A validated id parameter
 * @param {UpdateUserDto}  			dto            	A validated data transfer object
 * @param {UserRepository} 			userRepository 	A repository of user
 * @param {HashService}    			hashService    	A service for manage hash
 * @param {FileService}    			fileService    	A service for manage file
 * @return {Promise<UserResult>}                An updated user entity
 */
export async function updateUser(
	id: string,
	dto: UpdateUserDto,
	userRepository: UserRepository,
	fileService: FileService
): Promise<UserResult> {
	const { first_name: firstName, last_name: lastName, nickname, email } = dto;

	let input: Partial<UserTableInput> = {};

	if (firstName) {
		input = {
			...input,
			first_name: firstName,
		};
	}

	if (lastName) {
		input = {
			...input,
			last_name: lastName,
		};
	}

	if (nickname) {
		input = { ...input, nickname };
	}

	if (email) {
		input = { ...input, email };
	}

	const record = await userRepository.update(id, input);

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
