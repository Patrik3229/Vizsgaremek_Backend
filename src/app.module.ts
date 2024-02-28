import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [UsersModule, RecipesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
