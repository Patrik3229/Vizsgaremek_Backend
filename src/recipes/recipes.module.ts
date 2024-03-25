import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { PrismaService } from 'src/prisma.service';
import { AllergensService } from 'src/allergens/allergens.service';
import { RecipesAllergensService } from 'src/recipes_allergens/recipes_allergens.service';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService, PrismaService, AllergensService, RecipesAllergensService],
  exports: [RecipesService]
})
export class RecipesModule {}
