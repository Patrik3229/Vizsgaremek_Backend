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
  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.create(createRecipeDto);
  }

  /**
   * az összes receptet ki listázza
   * @returns egy listát a receptekből
   */
  @Get()
  findAll() {
    return this.recipesService.findAll();
  }


  @Get()
  topFive() {
    return this.recipesService.topfive();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('bearer'))
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(+id, updateRecipeDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('bearer'))
  updateManager(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto, @Request() req) {
    const user : Users = req.user
    if(user.role != 'manager' && user.role != 'admin'){
      throw new ForbiddenException()
    }
    return this.recipesService.update(+id, updateRecipeDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('bearer'))
  remove(@Param('id') id: string) {
    return this.recipesService.remove(+id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('bearer'))
  removeManager(@Param('id') id: string, @Request() req) {
    const user : Users = req.user
    if(user.role != 'manager' && user.role != 'admin'){
      throw new ForbiddenException()
    }
    return this.recipesService.remove(+id);
  }
}
