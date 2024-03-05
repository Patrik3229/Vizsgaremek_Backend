import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PrismaService } from 'src/prisma.service';
import { AllergensService } from 'src/allergens/allergens.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RecipesService {
  constructor(private readonly db : PrismaService, private readonly allergen : AllergensService) {}

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
    return this.db.recipes.findMany({
      take : 5
    })
  }

  findOne(id: number) {
    return this.db.recipes.findUnique({
      where : {id}
    })
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

  searchConent(string : string){
    if(string == ""){
      throw new BadRequestException('Üres string')
    }
    return this.db.recipes.findMany({
      where : {
        title : {
          contains : string
        },
        AND : {
          description : {
            contains : string
          }
        }
      }
    })
  }

  searchAllergen(string : string){
    if(string == ""){
      throw new BadRequestException('Üres string')
    } 
    const id_allergen = this.allergen.findbyName(string)
    return Prisma.raw(`SELECT id, title, description, preptime, posted FROM recipes INNER JOIN recipe_allergens ON recipes.id = recipe_id INNER JOIN allergens ON recipe_allergens.allergen_id = allergens.id WHERE allergens.id NOT ${id_allergen}`)
  }
}
