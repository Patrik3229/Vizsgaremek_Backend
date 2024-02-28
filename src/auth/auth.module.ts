import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PrismaService } from 'src/prisma.service';
import { TokenStrategy } from './token.strategy';

@Module({
  imports: [ UsersModule ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, TokenStrategy],
})
export class AuthModule {}
