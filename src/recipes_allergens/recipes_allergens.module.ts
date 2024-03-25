import { Module } from '@nestjs/common';
import { RecipesAllergensService } from './recipes_allergens.service';
import { RecipesAllergensController } from './recipes_allergens.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [RecipesAllergensController],
  providers: [RecipesAllergensService, PrismaService],
})
export class RecipesAllergensModule {}
