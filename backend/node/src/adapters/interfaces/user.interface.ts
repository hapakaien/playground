import type {
	CreateUserDto,
	UpdateUserDto,
	UserResult,
	UserTable,
} from '../../core/interfaces/user.interface';

export type UserRequestParams = Pick<UserTable, 'id'>;

export type CreateUser = Omit<CreateUserDto, 'photo'>;

export type UpdateUser = Omit<UpdateUserDto, 'photo'>;

export interface UserResponse extends UserResult {
	type: 'users';
}

export type UserData = Omit<UserResponse, 'type'>;
