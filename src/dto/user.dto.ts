import { Prisma, User } from '@prisma/client';

export class CreateUserDTO implements Prisma.UserCreateInput {
  name: string;
  email: string;
}

export class UpdateUserDTO implements Prisma.UserUpdateInput {
  name?: string;
  email?: string;
}

export class UserIdParamDTO implements Pick<User, 'id'> {
  id: number;
}
