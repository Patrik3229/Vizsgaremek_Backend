import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PrismaService } from 'src/prisma.service';
import { Ratings } from '@prisma/client';

@Injectable()
export class RecipesService {
  constructor(private readonly db : PrismaService) {}

  create(createRecipeDto: CreateRecipeDto) {
    return this.db.recipes.create({
      data: {
        title : createRecipeDto.title,
        description : createRecipeDto.description,
        content : createRecipeDto.content,
        user_id : createRecipeDto.user_id,
        posted : createRecipeDto.posted,
        preptime : createRecipeDto.preptime
      }
    })
  }

  findAll() {
    return this.db.recipes.findMany(
      //limit
    )
  }

  findOne(id: number) {
    return this.db.recipes.findUnique({
      where : {id}
    })
  }

  topfive(){
    return this.db.recipes.findMany(
      //limit and orderby
    )
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return this.db.recipes.update({
      where : {id},
      data : {
        title : updateRecipeDto.title,
        description : updateRecipeDto.description,
        content : updateRecipeDto.content,
        //the time will be reset to now
        posted : Date.now().toString(),
        preptime : updateRecipeDto.preptime
      }
    })
  }

  remove(id: number) {
    return this.db.recipes.delete({
      where : {id}
    })
  }
}
