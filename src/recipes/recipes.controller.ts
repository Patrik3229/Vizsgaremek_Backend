import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { AuthGuard } from '@nestjs/passport';
import { Users } from '@prisma/client';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  /**
   * új receptet fügvény
   * @param createRecipeDto 
   * @returns az adatbázisba új recept tesz bele
   */
  @Post('post')
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.create(createRecipeDto);
  }

  /**
   * recept kereső
   * @param searchText 
   * @param selectedAllergens 
   * @returns egy listát a megfelelő receptekről
   */
  @Get('searchContent')
  search(searchText : string, selectedAllergens : any[]){
    return this.recipesService.searchConent(searchText, selectedAllergens)
  }

  @Get('me:recipes')
  @UseGuards(AuthGuard('bearer'))
  meRecipes(@Request() req){
    const user : Users = req.user
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
   * @param id 
   * @returns receptet
   */
  @Get('find:id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(+id);
  }

  /**
   * egy specifikus receptet frissít
   * @param id 
   * @param updateRecipeDto 
   * @returns frissiti a receptet
   */
  @Patch('update:id')
  @UseGuards(AuthGuard('bearer'))
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(+id, updateRecipeDto);
  }

  /**
   * egy specifikus update-ja de mivel admin mindenkit tud
   * @param id 
   * @param updateRecipeDto 
   * @param req 
   * @returns frissiti a receptet
   */
  @Patch('update:admin')
  @UseGuards(AuthGuard('bearer'))
  updateManager(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto, @Request() req) {
    const user : Users = req.user
    if(user.role != 'manager' && user.role != 'admin'){
      throw new ForbiddenException()
    }
    return this.recipesService.update(+id, updateRecipeDto);
  }

  /**
   * egy specifikus receptet kitörli
   * @param id 
   * @returns kitörölt recept
   */
  @Delete('delete:id')
  @UseGuards(AuthGuard('bearer'))
  remove(@Param('id') id: string) {
    return this.recipesService.remove(+id);
  }

  /**
   * egy specifikus kitörli de mivel admin mindenkiét tudja
   * @param id 
   * @param req 
   * @returns kitörölt recept
   */
  @Delete('delete:admin')
  @UseGuards(AuthGuard('bearer'))
  removeManager(@Param('id') id: string, @Request() req) {
    const user : Users = req.user
    if(user.role != 'manager' && user.role != 'admin'){
      throw new ForbiddenException()
    }
    return this.recipesService.remove(+id);
  }
}
