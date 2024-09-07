import type { User } from '../entities/user.entity';
import type { BaseRepository } from './common.interface';

export interface CreateUserDto
	extends Omit<User, 'last_name' | 'nickname' | 'avatar'> {
	id: string;
	last_name: string | null;
	nickname?: string;
}

export type UpdateUserDto = Partial<CreateUserDto>;

export interface UserTable
	extends Pick<User, 'nickname'>,
		Omit<CreateUserDto, 'nickname'> {
	id: string;
	photo?: string | null;
	created_at: string;
	updated_at: string;
}

export interface UserTableInput
	extends Omit<UserTable, 'id' | 'created_at' | 'updated_at'>,
		Partial<Pick<UserTable, 'updated_at'>> {
	id?: string;
}

export interface UserRepository
	extends BaseRepository<UserTableInput, UserTable> {
	findOneByEmail: (email: string, id?: string) => Promise<UserTable | null>;
}

export type UserResult = UserTable & Pick<User, 'avatar'>;
