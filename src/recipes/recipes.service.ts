import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PrismaService } from 'src/prisma.service';
import { AllergensService } from 'src/allergens/allergens.service';

@Injectable()
export class RecipesService {
  constructor(private readonly db: PrismaService, private readonly allergen: AllergensService) { }

  /**
   * új recept poszt csinál
   * @param createRecipeDto 
   * @returns új receptet ad vissza
   */
  create(createRecipeDto: CreateRecipeDto) {
    return this.db.recipes.create({
      data: {
        title: createRecipeDto.title,
        description: createRecipeDto.description,
        content: createRecipeDto.content,
        user_id: createRecipeDto.user_id,
        posted: createRecipeDto.posted,
        preptime: createRecipeDto.preptime
      }
    })
  }

  /**
   * kilistázza az összes receptet
   * @returns listát a receptekről 5 hosszúságú
   */
  findAll() {
    return this.db.recipes.findMany({
      take: 5
    })
  }

  findMine(id: number) {
    return this.db.recipes.findMany({
      where: {
        user_id: id
      },
      select: {
        content: false
      }
    })
  }

  /**
   * 1 recept adatinak a keresée
   * @param id a recetp id amit meg akarunk keresni
   * @returns a kersett recept adatai
   */
  findOne(id: number) {
    return this.db.recipes.findUnique({
      where: { id }
    })
  }

  /**
   * recept frissítő
   * @param id a recept id-ja
   * @param updateRecipeDto a modosítandó adatok 
   * @returns 
   */
  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return this.db.recipes.update({
      where: { id },
      data: {
        title: updateRecipeDto.title,
        description: updateRecipeDto.description,
        content: updateRecipeDto.content,
        //the time will be reset to now
        posted: Date.now().toString(),
        preptime: updateRecipeDto.preptime
      }
    })
  }

  remove(id: number) {
    return this.db.recipes.delete({
      where: { id }
    })
  }

  searchConent(string: string, array: any[]) {
    if (string == "") {
      throw new BadRequestException('Empty string')
    }
    const stringSql = `'%${string}%'`
    const checkedArray: number[] = this.arrayChecker(array)
    const arrayString: string = this.arrayToString(checkedArray)
    if (array.length == 0) {
      return this.db.$queryRaw`SELECT id, title, description, preptime, posted, AVG(ratings.rating) AS rating FROM recipes INNER JOIN recipe_allergens ON recipes.id = recipe_id INNER JOIN allergens ON recipe_allergens.allergen_id = allergens.id INNER JOIN ratings ON recipes.id = ratings.recipes_id WHERE title LIKE ${stringSql} OR recipes.description LIKE ${stringSql};`
    }
    return this.db.$queryRaw`SELECT id, title, description, preptime, posted, AVG(ratings.rating) AS rating FROM recipes INNER JOIN recipe_allergens ON recipes.id = recipe_id INNER JOIN allergens ON recipe_allergens.allergen_id = allergens.id INNER JOIN ratings ON recipes.id = ratings.recipes_id WHERE title LIKE ${stringSql} OR recipes.description LIKE ${stringSql} AND allergens.id NOT IN ${arrayString};`
  }

  arrayChecker(array: any[]) {
    for (let i = 0; i < array.length; i++) {
      if (!Number(array[i])) {
        throw new BadRequestException('Array contains something other than numbers')
      }
    }
    return array
  }

  arrayToString(array: number[]) {
    let string: string = "("
    for (let i = 0; i < array.length; i++) {
      string = array[i].toString() + ", "
      if (i == array.length - 1) {
        string = array[i].toString()
      }
    }
    string += ")"
    return string
  }
}
