import type {
	UserRefreshRequest,
	UserRequest,
} from '../../../../core/interfaces/user.interface';

declare global {
	namespace Express {
		interface Request {
			user?: UserRequest | UserRefreshRequest | undefined;
		}
	}
}
