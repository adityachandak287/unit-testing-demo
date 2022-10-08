import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaClient, Prisma } from '@prisma/client';
import { join } from 'path';


const DB_OPTIONS: Prisma.PrismaClientOptions = {
  datasources: {
    db: {
      url: 'file:' + join(process.cwd(), 'sqlite.db'),
    },
  },
};

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    {
      provide: 'DATABASE_CLIENT',
      useValue: new PrismaClient(DB_OPTIONS),
    },
    AppService,
  ],
})
export class AppModule {}
