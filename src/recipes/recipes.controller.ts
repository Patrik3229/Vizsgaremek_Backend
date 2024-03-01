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
   * az összes receptet ki listázza
   * @returns egy listát a receptekből
   */
  @Get('all')
  findAll() {
    return this.recipesService.findAll();
  }


  @Get('top5')
  topFive() {
    return this.recipesService.topfive();
  }


  @Get('find:id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(+id);
  }

  @Patch('update:id')
  @UseGuards(AuthGuard('bearer'))
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(+id, updateRecipeDto);
  }

  @Patch('update:admin')
  @UseGuards(AuthGuard('bearer'))
  updateManager(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto, @Request() req) {
    const user : Users = req.user
    if(user.role != 'manager' && user.role != 'admin'){
      throw new ForbiddenException()
    }
    return this.recipesService.update(+id, updateRecipeDto);
  }

  @Delete('delete:id')
  @UseGuards(AuthGuard('bearer'))
  remove(@Param('id') id: string) {
    return this.recipesService.remove(+id);
  }

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
