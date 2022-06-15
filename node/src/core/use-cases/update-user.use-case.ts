import { NotFoundException } from '../exceptions/not-found.exception';
import type { FileService } from '../interfaces/file.interface';
import type { HashService } from '../interfaces/hash.interface';
import type {
	UpdateUserDto,
	UserRepository,
	UserTableInput,
} from '../interfaces/user.interface';

/**
 * Update an user.
 *
 * If the user is not found, a custom exception will be thrown.
 *
 * @param {string}         id             A validated id parameter
 * @param {UpdateUserDto}  dto            A validated data transfer object
 * @param {UserRepository} userRepository A repository of user
 * @param {HashService}    hashService    A service for manage hash
 * @param {FileService}    fileService    A service for manage file
 */
export async function updateUser(
	id: string,
	dto: UpdateUserDto,
	userRepository: UserRepository,
	hashService: HashService,
	fileService: FileService
) {
	const { name, nickname, email, password, photo: file } = dto;

	let input: Partial<UserTableInput> = {};

	if (name) {
		input = { ...input, name };
	}

	if (nickname) {
		input = { ...input, nickname };
	}

	if (email) {
		input = { ...input, email };
	}

	if (password) {
		input = { ...input, password: await hashService.create(password) };
	}

	const record = await userRepository.update(id, input);

	if (!record) {
		throw new NotFoundException('The user is not found.');
	}

	const photo = await fileService.upload(
		file,
		record.photo ? record.photo : ''
	);

	await userRepository.update(id, { photo });

	const { password: ignorePassword, ...data } = record;

	return {
		...data,
		photo,
		avatar: photo ? await fileService.getUrl(photo) : null,
	};
}
