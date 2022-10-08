import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PrismaClient, User } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(
    @Inject('DATABASE_CLIENT') private readonly dbClient: PrismaClient,
  ) {}

  getHello() {
    return { msg: 'Hello World' };
  }

  async getAllUsers(): Promise<User[]> {
    return this.dbClient.user.findMany();
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.dbClient.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async createUser(user: Prisma.UserCreateInput): Promise<User> {
    try {
      return await this.dbClient.user.create({
        data: user,
      });
    } catch (createError) {
      throw new BadRequestException();
    }
  }

  async updateUser(id: number, user: Prisma.UserUpdateInput): Promise<boolean> {
    let updatedUsers: number;
    try {
      const updateRes = await this.dbClient.user.updateMany({
        where: {
          id,
        },
        data: user,
      });
      updatedUsers = updateRes.count;
    } catch (updateError) {
      throw new BadRequestException();
    }

    if (updatedUsers < 1) {
      throw new NotFoundException();
    }

    return updatedUsers === 1;
  }

  async deleteUser(id: number): Promise<boolean> {
    const deletedUsers = await this.dbClient.user.deleteMany({
      where: {
        id,
      },
    });

    if (deletedUsers.count < 1) {
      throw new NotFoundException();
    }

    return deletedUsers.count === 1;
  }
}
