import type {
	UpdateUserDto,
	UserRepository,
	UserTable,
} from '../../core/interfaces/user.interface';
import { uniqueUserEmail } from '../../core/use-cases/unique-user-email.use-case';
import type { HttpRequest } from '../interfaces/http.interface';

export function uniqueUserEmailController(
	userRepository: UserRepository
): (
	req: HttpRequest<unknown, Pick<UserTable, 'id'>, Pick<UpdateUserDto, 'email'>>
) => Promise<boolean> {
	return async (
		req: HttpRequest<
			unknown,
			Pick<UserTable, 'id'>,
			Pick<UpdateUserDto, 'email'>
		>
	): Promise<boolean> => {
		if (!req.body) {
			return true;
		}

		const { email } = req.body;

		if (!email) {
			return true;
		}

		const result = await uniqueUserEmail(userRepository, email, req.params?.id);

		return result;
	};
}
