import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PrismaService } from 'src/prisma.service';
import { TokenStrategy } from './token.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [ UsersModule ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, TokenStrategy,JwtService ],
})
export class AuthModule {}
