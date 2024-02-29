import { Module } from '@nestjs/common';
import { AllergensService } from './allergens.service';
import { AllergensController } from './allergens.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AllergensController],
  providers: [AllergensService, PrismaService]
})
export class AllergensModule {}
