import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient, Prisma, User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(@Inject('DATABASE_CLIENT') private dbClient: PrismaClient) {}

  async findAll(): Promise<User[]> {
    return this.dbClient.user.findMany();
  }

  async findUserById(id: number): Promise<User> {
    return this.dbClient.user.findUnique({
      where: {
        id,
      },
    });
  }

  async createUser(user: Prisma.UserCreateInput): Promise<User> {
    return this.dbClient.user.create({
      data: user,
    });
  }

  async updateUser(id: number, user: Prisma.UserUpdateInput): Promise<boolean> {
    const updatedUsers = await this.dbClient.user.updateMany({
      where: {
        id,
      },
      data: user,
    });

    return updatedUsers.count === 1;
  }

  async deleteUser(id: number): Promise<boolean> {
    const deletedUsers = await this.dbClient.user.deleteMany({
      where: {
        id,
      },
    });

    return deletedUsers.count === 1;
  }
}
