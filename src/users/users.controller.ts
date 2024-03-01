import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

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
    if(passwordRegex.test(createUserDto.password) || passwordRegex.test(createUserDto.passwordAgain)){
      /**hiba üzenet ha nem fele meg az egyik */
      throw new UnauthorizedException('A jeszók nem egyeznek meg az elvárásnak')
    }
    /**le ellenörzi hogy a megadott jelszók egyeznek */
    if(createUserDto.password != createUserDto.passwordAgain){
      /**hiba üzenet a nem egyező jelszavaknál */
      throw new UnauthorizedException('A jelszavak nem egyeznek')
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
      throw new ForbiddenException('Ehhez nincs jogosultságod');
    }
    return this.usersService.findAll();
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

  //TODO:findbyName

  /**
   * a bejelenkezett user adatait frissítése
   * @param id user id
   * @param updateUserDto megváltoztatni való adatok
   * @returns adatbázisban megváltoztatja az adatokat
   */
  @Patch('update')
  @UseGuards(AuthGuard('bearer'))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //TODO new password hash
    return this.usersService.update(+id, updateUserDto);
  }


  /**
   * egy user adatait tudja kitörölni
   * @param id user id
   * @returns kitöli az adatokat -> egyből ki jelenkezteti
   */
  @Patch('update:admin')
  @UseGuards(AuthGuard('bearer'))
  updateRole(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    const user: Users = req.user;
    if (user.role != 'manager') {
      throw new ForbiddenException();
    }

    return this.usersService.update(+id, updateUserDto);
  }

  @Delete('delete')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Delete('update:admin')
  removeManager(@Param('id') id: string, @Request() req) {

    const user: Users = req.user;
    if (user.role != 'manager') {
      throw new ForbiddenException();
    }

    return this.usersService.removeManager(+id);
  }
}
