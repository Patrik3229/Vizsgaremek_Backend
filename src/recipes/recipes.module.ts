import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { PrismaService } from 'src/prisma.service';
import { AllergensService } from 'src/allergens/allergens.service';
import { RecipesAllergensService } from 'src/recipes_allergens/recipes_allergens.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService, PrismaService, AllergensService, RecipesAllergensService, UsersService],
  exports: [RecipesService]
})
export class RecipesModule {}
