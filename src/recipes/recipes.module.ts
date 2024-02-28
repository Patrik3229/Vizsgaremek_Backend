import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService, PrismaClient],
  exports: [RecipesService]
})
export class RecipesModule {}
