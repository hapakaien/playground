import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import {
	compatUpdate,
	create,
	findAll,
	findOne,
	remove,
	update,
} from '../handlers/user.handler';
import { uniqueUserEmail } from '../middlewares/unique-user-email';
import { validate } from '../middlewares/validator';
import { idParamSchema } from '../schemas/common.schema';
import {
	compatUpdateUserSchema,
	createUserSchema,
	findAllUserSchema,
	updateUserSchema,
} from '../schemas/user.schema';

const userRouter = Router();

userRouter.get(
	'/',
	[validate(findAllUserSchema, 'query')],
	asyncHandler(findAll)
);

userRouter.post(
	'/',
	[validate(createUserSchema)],
	uniqueUserEmail(),
	asyncHandler(create)
);

userRouter.get(
	'/:id',
	validate(idParamSchema, 'params'),
	asyncHandler(findOne)
);

userRouter.patch(
	'/:id',
	[validate(idParamSchema, 'params'), validate(updateUserSchema)],
	uniqueUserEmail(),
	asyncHandler(update)
);

userRouter.put(
	'/',
	[validate(compatUpdateUserSchema)],
	uniqueUserEmail(),
	asyncHandler(compatUpdate)
);

userRouter.delete(
	'/:id',
	validate(idParamSchema, 'params'),
	asyncHandler(remove)
);

export { userRouter };
