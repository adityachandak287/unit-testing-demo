import { AppService } from './app.service';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AppService (Mocking)', () => {
  let service: AppService;
  let mockDbClient: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    mockDbClient = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: 'DATABASE_CLIENT', useValue: mockDbClient },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  afterEach(() => {
    mockReset(mockDbClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getHello should return Hello World message', () => {
    expect(service.getHello()).toEqual({ msg: 'Hello World' });
  });

  describe('getAllUsers', () => {
    it('getAllUsers should return empty array if no users exist', async () => {
      mockDbClient.user.findMany.mockResolvedValueOnce([]);

      const users = await service.getAllUsers();

      expect(users).toEqual([]);
    });

    it('getAllUsers should return list of users', async () => {
      const userList: User[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
        },
      ];

      mockDbClient.user.findMany.mockResolvedValueOnce(userList);

      const users = await service.getAllUsers();

      expect(users).toEqual(userList);
    });
  });

  describe('findUserById', () => {
    it('findUserById should return user which with given id', async () => {
      const mockUser: User = {
        id: 999,
        name: 'John Doe',
        email: 'john@example.com',
      };

      mockDbClient.user.findUnique.mockResolvedValueOnce(mockUser);

      const user = await service.findUserById(mockUser.id);

      expect(user).toEqual(mockUser);
      expect(mockDbClient.user.findUnique).toHaveBeenCalledTimes(1);
      expect(mockDbClient.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: mockUser.id,
        },
      });
    });

    it('findUserById should throw NotFoundException if user does not exist', async () => {
      mockDbClient.user.findUnique.mockResolvedValueOnce(null);

      await expect(async () => {
        await service.findUserById(1234);
      }).rejects.toThrowError(NotFoundException);

      expect(mockDbClient.user.findUnique).toHaveBeenCalledTimes(1);
      expect(mockDbClient.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: 1234,
        },
      });
    });
  });

  describe('createUser', () => {
    it('createUser should create and return user with id', async () => {
      const mockUser: User = {
        id: 999,
        name: 'John Doe',
        email: 'john@example.com',
      };

      mockDbClient.user.create.mockResolvedValueOnce(mockUser);

      const user = await service.createUser({
        name: mockUser.name,
        email: mockUser.email,
      });

      expect(user).toEqual(mockUser);
      expect(mockDbClient.user.create).toHaveBeenCalledTimes(1);
      expect(mockDbClient.user.create).toHaveBeenCalledWith({
        data: {
          name: mockUser.name,
          email: mockUser.email,
        },
      });
    });

    it('createUser should throw BadRequestException if database constraints fail', async () => {
      const mockUser: Prisma.UserCreateInput = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      mockDbClient.user.create.mockRejectedValueOnce(new BadRequestException());

      await expect(async () => {
        await service.createUser(mockUser);
      }).rejects.toThrowError(BadRequestException);

      expect(mockDbClient.user.create).toHaveBeenCalledTimes(1);
      expect(mockDbClient.user.create).toHaveBeenCalledWith({
        data: mockUser,
      });
    });
  });

  describe('updateUser', () => {
    it('updateUser should return true if user is updated', async () => {
      mockDbClient.user.updateMany.mockResolvedValueOnce({
        count: 1,
      });

      const isUserUpdated = await service.updateUser(789, {});

      expect(isUserUpdated).toEqual(true);
      expect(mockDbClient.user.updateMany).toHaveBeenCalledTimes(1);
      expect(mockDbClient.user.updateMany).toHaveBeenCalledWith({
        where: {
          id: 789,
        },
        data: {},
      });
    });

    it('updateUser should throw NotFoundException if user with given id does not exist', async () => {
      mockDbClient.user.updateMany.mockResolvedValueOnce({ count: 0 });

      await expect(async () => {
        await service.updateUser(100, {});
      }).rejects.toThrowError(NotFoundException);

      expect(mockDbClient.user.updateMany).toHaveBeenCalledTimes(1);
      expect(mockDbClient.user.updateMany).toHaveBeenCalledWith({
        where: {
          id: 100,
        },
        data: {},
      });
    });

    it('updateUser should throw NotFoundException if user with given id does not exist', async () => {
      mockDbClient.user.updateMany.mockRejectedValueOnce(
        new BadRequestException(),
      );

      await expect(async () => {
        await service.updateUser(123, {});
      }).rejects.toThrowError(BadRequestException);

      expect(mockDbClient.user.updateMany).toHaveBeenCalledTimes(1);
      expect(mockDbClient.user.updateMany).toHaveBeenCalledWith({
        where: {
          id: 123,
        },
        data: {},
      });
    });
  });

  describe('deleteUser', () => {
    it('deleteUser should return true if user with given id is deleted', async () => {
      mockDbClient.user.deleteMany.mockResolvedValueOnce({
        count: 1,
      });

      const isUserDeleted = await service.deleteUser(101);

      expect(isUserDeleted).toEqual(true);
      expect(mockDbClient.user.deleteMany).toHaveBeenCalledTimes(1);
      expect(mockDbClient.user.deleteMany).toHaveBeenCalledWith({
        where: {
          id: 101,
        },
      });
    });

    it('deleteUser should throw NotFoundException if user does not exist', async () => {
      mockDbClient.user.deleteMany.mockResolvedValueOnce({
        count: 0,
      });

      await expect(async () => {
        await service.deleteUser(1234);
      }).rejects.toThrowError(NotFoundException);

      expect(mockDbClient.user.deleteMany).toHaveBeenCalledTimes(1);
      expect(mockDbClient.user.deleteMany).toHaveBeenCalledWith({
        where: {
          id: 1234,
        },
      });
    });
  });
});
