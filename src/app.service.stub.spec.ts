import { AppService } from './app.service';
import { User } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

describe.skip('AppService (Stub)', () => {
  it('getAllUsers should return all users', async () => {
    class UserClientStub {
      async findMany(): Promise<User[]> {
        return [{ id: 1, name: 'John', email: 'john@test.com' }];
      }
    }

    class DbClientStub {
      user: UserClientStub;
      constructor() {
        this.user = new UserClientStub();
      }
    }

    /**
       * Alternate way of creating stub
       * ```
       * const mockDbClient = {
            user: {
              findMany: async (): Promise<User[]> => {
                return [{ id: 1, name: 'John', email: 'john@test.com' }];
              },
            },
          };
       * ```
       */

    const dbClientStub = new DbClientStub();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: 'DATABASE_CLIENT',
          useValue: dbClientStub,
        },
      ],
    }).compile();

    const dbClientSpy = jest.spyOn(dbClientStub.user, 'findMany');

    const service = module.get<AppService>(AppService);

    const users = await service.getAllUsers();

    expect(users).toEqual([{ id: 1, name: 'John', email: 'john@test.com' }]);
    expect(dbClientSpy).toHaveBeenCalledTimes(1);
  });
});
