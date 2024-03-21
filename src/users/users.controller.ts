import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { roleUpdateDto } from './dto/role-update.dto';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /**
   * A bejelenkezett user adatait adja vissza
   * a 'GET' body üres
   * @param req Token szerint tudja megondani melyik
   * @returns megadott user adatait (kivéve a password)
   */
  @Get('me')
  /**Kötelező a token megadni */
  @UseGuards(AuthGuard('bearer'))
  me(@Request() req) {
    const user: Users = req.user;
    return {
      email: user.email,
      name: user.name,
      role: user.role,
    }
  }

  /**
   * Regisztrációra használt fügvény, a hash miatt async
   * @param createUserDto 
   * @returns az adatbázisba bele teszi az új user-t
   */
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    /**regex leelenőrzi a jelszavkat */
    if (!passwordRegex.test(createUserDto.password) || !passwordRegex.test(createUserDto.passwordAgain)) {
      /**hiba üzenet ha nem fele meg az egyik */
      throw new UnauthorizedException('Weak password, atleast 8 charater long contains 1 upper case, 1 lowercase and 1 number')
    }
    /**le ellenörzi hogy a megadott jelszók egyeznek */
    if (createUserDto.password != createUserDto.passwordAgain) {
      /**hiba üzenet a nem egyező jelszavaknál */
      throw new UnauthorizedException(`Passwords doesn't match`)
    }
    /**jelzsót hashjük */
    const secret = await this.usersService.passwordHash(createUserDto.password)
    return this.usersService.create(createUserDto, secret)
  }

  /**
   * minden user listázása
   * sima user nem tudja meghívni ezt
   * a 'GET' body üres
   * @param req 
   * @returns user lista
   */
  @Get('all')
  /**token megadása kötelező */
  @UseGuards(AuthGuard('bearer'))
  findAll(@Request() req) {
    const user: Users = req.user;
    /**token alapján megnézzük a user jogosultságát */
    if (user.role != 'admin' && user.role != 'manager') {
      throw new ForbiddenException(`You don't have premission to do this`);
    }
    return this.usersService.findAll(user.id);
  }

  /**
   * egy specifikus user megkeresése
   * mivel ezt guest mode is el lehet érni ehhez nem kell token
   * @param id 
   * @returns user adatokat
   */
  @Get('find:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get('search:string')
  @UseGuards(AuthGuard('bearer'))
  AdminUserSearch(@Param('string') string : string,@Request() req) {
    const user: Users = req.user;
    if (user.role != 'manager' && user.role != 'admin') {
      throw new ForbiddenException(`You don't have premissoin to do this`);
    }
    return this.usersService.searchAdmin(user.id, string)
  }

  /**
   * a bejelenkezett user adatait frissítése
   * @param id user id
   * @param updateUserDto megváltoztatni való adatok
   * @returns adatbázisban megváltoztatja az adatokat
   */
  @Patch('update:id')
  @UseGuards(AuthGuard('bearer'))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //TODO new password hash
    return this.usersService.update(+id, updateUserDto);
  }


  /**
   * egy user adatait tudja kitörölni rankot
   * @param id user id
   * @returns kitöli az adatokat -> egyből ki jelenkezteti
   */
  @Patch('update-admin:id')
  @UseGuards(AuthGuard('bearer'))
  updateRole(@Param('id') id: string, @Body() role: roleUpdateDto, @Request() req) {
    const user: Users = req.user;
    if (user.role != 'manager') {
      throw new ForbiddenException();
    }
    return this.usersService.updateRole(+id, role);
  }

  /**
   * a belejelenkezett felhasználot kitörli
   * @param id 
   * @returns kitörli a felhasználót
   */
  @Delete('delete-self:id')
  @UseGuards(AuthGuard('bearer'))
  removeSelf(@Param('id') id: string, @Request() req) {
    const user: Users = req.user
    if (user.id != parseInt(id)) {
      throw new ForbiddenException(`You don't have premissoin to do this`)
    }
    return this.usersService.remove(+id);
  }

  /**
   * admin/manager által bárki kitörlést
   * @param id 
   * @param req 
   * @returns kitöröli a felhasználót
   */
  @Delete('delete:id')
  @UseGuards(AuthGuard('bearer'))
  remove(@Param('id') id: string, @Request() req) {
    const user: Users = req.user;
    if (user.role != 'manager' && user.role != 'admin') {
      throw new ForbiddenException(`You don't have premissoin to do this`);
    }
    return this.usersService.remove(+id);
  }
}
