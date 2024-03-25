import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { RecipesModule } from './recipes/recipes.module';
import { RatingsModule } from './ratings/ratings.module';
import { AllergensModule } from './allergens/allergens.module';
import { AuthModule } from './auth/auth.module';
import { RecipesAllergensModule } from './recipes_allergens/recipes_allergens.module';

@Module({
  imports: [UsersModule, RecipesModule, RatingsModule, AllergensModule, AuthModule, RecipesAllergensModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
