import { createUser } from '../../src/core/use-cases/create-user.use-case';
import { findAllUsers } from '../../src/core/use-cases/find-all-users.use-case';
import { findOneUser } from '../../src/core/use-cases/find-one-user.use-case';
import { removeUser } from '../../src/core/use-cases/remove-user.use-case';
import { uniqueUserEmail } from '../../src/core/use-cases/unique-user-email.use-case';
import { updateUser } from '../../src/core/use-cases/update-user.use-case';

jest.mock('../../src/core/use-cases/update-user.use-case');
export const mockedUpdateUser = jest.mocked(updateUser);

jest.mock('../../src/core/use-cases/find-one-user.use-case');
export const mockedFindOneUser = jest.mocked(findOneUser);

jest.mock('../../src/core/use-cases/remove-user.use-case');
export const mockedRemoveUser = jest.mocked(removeUser);

jest.mock('../../src/core/use-cases/create-user.use-case');
export const mockedCreateUser = jest.mocked(createUser);

jest.mock('../../src/core/use-cases/unique-user-email.use-case');
export const mockedUniqueUserEmail = jest.mocked(uniqueUserEmail);

jest.mock('../../src/core/use-cases/find-all-users.use-case');
export const mockedFindAllUsers = jest.mocked(findAllUsers);
