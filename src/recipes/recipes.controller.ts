import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException, BadRequestException } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { AuthGuard } from '@nestjs/passport';
import { Users } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) { }

  /**
   * új receptet fügvény
   * @param createRecipeDto a recept létrehozzásához tartozó adatok
   * @returns az adatbázisba új recept tesz bele
   */
  @Post('post')
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.create(createRecipeDto);
  }

  /**
   * recept kereső
   * @param searchText keresőben beírt szöveg KÖTELEZŐ
   * @param selectedAllergens allergenek id álló lista NEM KÖTELEZŐ
   * @returns egy listát a megfelelő receptekről
   */
  @Get('searchContent')
  search(searchText: string, selectedAllergens: any[]) {
    return this.recipesService.searchConent(searchText, selectedAllergens)
  }

  /**
   * a saját recepteket kérdezi le
   * @param req a token lekérdezett user 
   * @returns receptekbő álló listát
   */
  @Get('me:recipes')
  @UseGuards(AuthGuard('bearer'))
  meRecipes(@Request() req) {
    const user: Users = req.user
    return this.recipesService.findMine(user.id)
  }

  /**
   * az összes receptet ki listázza
   * @returns egy listát a receptekből
   */
  @Get('all')
  findAll() {
    return this.recipesService.findAll();
  }

  /**
   * visszaad egy specifikus receptet
   * @param id recept id-ja
   * @returns receptet
   */
  @Get('find:id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(+id);
  }

  /**
   * ADMIN FUNCTION
   * egy user receptjeit adja vissza
   * @param id user id-ja
   * @param req a request beköldő token kiolvasott id
   * @returns receptekből álló lista
   */
  @Get('search-user:id')
  @UseGuards(AuthGuard('bearer'))
  NameSearch(@Param('id') id: string, @Request() req){
    const user : Users = req.user
    if (user.role != 'manager' && user.role != 'admin') {
      throw new ForbiddenException('You dont have premmision for it')
    }
    return this.recipesService.findAllUser(+id);
  }

  /**
   * egy specifikus receptet frissít
   * @param id recept id-ja
   * @param updateRecipeDto frissítendő adatok  
   * @returns frissiti a receptet
   */
  @Patch('update:id')
  @UseGuards(AuthGuard('bearer'))
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(+id, updateRecipeDto);
  }

  /**
   * ADMIN FUNCTION
   * egy specifikus update-ja de mivel admin mindenkit tud
   * @param id recept id-ja
   * @param updateRecipeDto  frissítendő adatok
   * @param req a request beköldő token kiolvasott id
   * @returns frissiti a receptet
   */
  @Patch('update-admin:id')
  @UseGuards(AuthGuard('bearer'))
  updateManager(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto, @Request() req) {
    const user: Users = req.user
    if (user.role != 'manager' && user.role != 'admin') {
      throw new ForbiddenException('You dont have premmision for it')
    }
    return this.recipesService.update(+id, updateRecipeDto);
  }

  /**
   * egy specifikus receptet kitörli
   * @param id recept id
   * @param reqa request beköldő token kiolvasott id
   * @returns kitörölt recept
   */
  @Delete('delete:id')
  @UseGuards(AuthGuard('bearer'))
  remove(@Param('id') id: string, @Request() req) {
    const user : Users = req.user
    if(user.id != parseInt(id)){
      throw new ForbiddenException('You dont have premmision for it')
    }
    return this.recipesService.remove(+id);
  }

  /**
   * ADMIN FUNCTION
   * egy specifikus kitörli de mivel admin mindenkiét tudja
   * @param id recept id-ja
   * @param req a request beköldő token kiolvasott id
   * @returns kitörölt recept
   */
  @Delete('delete-admin:id')
  @UseGuards(AuthGuard('bearer'))
  removeManager(@Param('id') id: string, @Request() req) {
    const user: Users = req.user
    if (user.role != 'manager' && user.role != 'admin') {
      throw new ForbiddenException('You dont have premmision for it')
    }
    return this.recipesService.remove(+id);
  }
}
