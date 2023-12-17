import type {
	CreateUserDto,
	UserRepository,
	UserResult,
} from '../interfaces/user.interface';

/**
 * Create an user.
 *
 * If there is an error, a basic exception will be thrown.
 *
 * @param {CreateUserDto}  			 dto            Validated data transfer object
 * @param {UserRepository} 			 userRepository A repository of user
 * @param {HashService}    			 hashService    A service for manage hash
 * @return {Promise<UserResult>}                An user entity
 */
export async function createUser(
	dto: CreateUserDto,
	userRepository: UserRepository
): Promise<UserResult> {
	const { first_name: firstName, last_name: lastName, email } = dto;

	const record = await userRepository.create({
		first_name: firstName,
		last_name: lastName,
		email,
	});

	if (!record) {
		throw new Error('Something went wrong.');
	}

	return {
		...record,
		avatar: null,
	};
}
