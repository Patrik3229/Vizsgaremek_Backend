import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { PrismaService } from 'src/prisma.service';
import { AllergensService } from 'src/allergens/allergens.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [RatingsController],
  providers: [RatingsService, PrismaService, UsersService]
})
export class RatingsModule {}
