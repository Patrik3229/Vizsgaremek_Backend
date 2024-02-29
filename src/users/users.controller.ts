import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard('bearer'))
  me(@Request() req) {
    const user: Users = req.users;
    return {
      email: user.email,
      name: user.name,
      role: user.role,
    }
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    if(createUserDto.password != createUserDto.passwordAgain){
      throw new UnauthorizedException('A jelszavak nem egyeznek')
    }
    const secret = await this.usersService.passwordHash(createUserDto.password)
    return this.usersService.create(createUserDto, secret)
  }

  @Get('all')
  @UseGuards(AuthGuard('bearer'))
  findAll(@Request() req) {
    const user: Users = req.user;
    if (user.role != 'admin') {
      throw new ForbiddenException();
    }
    // Ezt a függvényt csak admin jogosultságú user tudja meghívni
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
