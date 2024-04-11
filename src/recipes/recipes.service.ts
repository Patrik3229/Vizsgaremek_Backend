import { BadRequestException, GoneException, Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PrismaService } from 'src/prisma.service';
import { AllergensService } from 'src/allergens/allergens.service';
import { RecipesAllergensService } from 'src/recipes_allergens/recipes_allergens.service';
import { Search } from './dto/search-class';
import { tr } from '@faker-js/faker';

@Injectable()
export class RecipesService {
  constructor(private readonly db: PrismaService, private readonly allergen: AllergensService, private readonly connectTable : RecipesAllergensService) { }

  /**
   * új recept poszt csinál
   * @param createRecipeDto a user altal bekuldott adatok, a body talalhato adatok
   * @returns új receptet ad vissza
   */
  async create(id : number, createRecipeDto: CreateRecipeDto) {
    const chechedAllergens : number[] = this.arrayChecker(createRecipeDto.allergens)
    const recipe = await this.db.recipes.create({
      data: {
        title: createRecipeDto.title,
        description: createRecipeDto.description,
        content: createRecipeDto.content,
        user_id: id,
        preptime: createRecipeDto.preptime
      }
    })
    /**a kapcsolo tablahoz felvesszuk */
    await this.db.recipe_Allergens.createMany({
      data : chechedAllergens.map(a => ({
        allergen_id : a,
        recipe_id: recipe.id
      }))
    })
    return recipe
  }

  /**
   * kilistázza az összes receptet
   * @returns listát a receptekről 5 hosszúságú
   */
  async findAll() {
    return await this.db.$queryRaw`SELECT r.id,r.title,r.description,r.content,r.preptime,r.posted, r.user_id,users.name as 'username' FROM recipes AS R INNER JOIN users ON r.user_id = users.id`
  }

  /**
   * saját recepteket kereső
   * @param id user id-ja
   * @returns kikeresi az összes receptet ami a felhasználóé
   */
  async findMine(id: number) {
    return await this.db.$queryRaw`SELECT r.id,r.title,r.description,r.content,r.preptime,r.posted, r.user_id, users.name as 'username' FROM recipes AS R INNER JOIN users ON r.user_id = users.id WHERE r.user_id = ${id}`
  }

  /**
   * 1 user összes receptjét adja vissza
   * @param id user id-ja
   * @returns egy recepteket tartalamzó listát
   */
  async findAllUser(id: number) {
    const a = await this.db.$queryRaw`SELECT r.id,r.title,r.description,r.content,r.preptime,r.posted, r.user_id,users.name as 'username' FROM recipes AS R INNER JOIN users ON r.user_id = users.id WHERE r.user_id = ${id}`
    return a
  }

  /**
   * 1 user összes receptjét adja vissza
   * @param id user id-ja
   * @returns egy recepteket tartalamzó listát
   */
  async findUser(id: number) {
    return await this.db.recipes.findMany({
      where : {
        user_id : id
      },
      select : {
        title : true,
        description : true,
        id : true,
        preptime : true,
        content : false,
        posted : true,
        user_id:false        
      }
    })
  }

  /**
   * 1 recept adatinak a keresée
   * @param id a recetp id amit meg akarunk keresni
   * @returns a kersett recept adatai
   */
  async findOne(id: number) {
    const a = await this.db.$queryRaw`SELECT r.id,r.title,r.description,r.content,r.preptime,r.posted, r.user_id, users.name as 'username' FROM recipes AS R INNER JOIN users ON r.user_id = users.id WHERE r.id = ${id}`
    return a[0]
  }
  

  /**
   * recept frissítő
   * @param id a recept id-ja
   * @param updateRecipeDto a modosítandó adatok 
   * @returns updated receptel
   */
   async update(id: number, updateRecipeDto: UpdateRecipeDto) {
    /**a kapcsoló tábla frisítése, add + delete */
    if (updateRecipeDto.allergens != null && updateRecipeDto.allergens.length != 0) {
      const results = await this.db.recipe_Allergens.findMany({
        where: {
          recipe_id: id
        },
        select: {
          allergen_id: true
        }
      })
      const currectAllergens = results.map(x => x.allergen_id)  
      const remoreAllergens = updateRecipeDto.allergens.filter(x => currectAllergens.indexOf(x) < 0)
      this.RemovedAllergens(updateRecipeDto.id, remoreAllergens)
      const createAllergens = currectAllergens.filter(x => updateRecipeDto.allergens.indexOf(x) < 0)
      this.CreateAllergens(updateRecipeDto.id, createAllergens)
    }
    return await this.db.recipes.update({
      where: { id },
      data: {
        title: updateRecipeDto.title,
        description: updateRecipeDto.description,
        content: updateRecipeDto.content,
        /**Az időt mindig amikor lefut az update kicseréljük */
        posted: new Date().toISOString(),
        preptime: updateRecipeDto.preptime
      }
    })
  }

  /**
   * receptet töröl ki
   * @param id a recept id-ja
   * @returns kitörölt recept
   */
  remove(id: number) {
    console.log("*********" + id)
    return this.db.recipes.delete({
      where: {
         id: id
        }
    })
  }

  /**
   * kereső tartalom és allegens szerint
   * @param string keresőben lévő szöveg
   * @param array allergene az id tömbje (lehet 1 is)
   * @returns a keresésnek megfelelő receptek
   */
  searchConent(array: Search) {
    /**megnézzük hogy a szöveg nem üres */
    const data = array
    console.log(`***************${JSON.stringify(data.searchText)}, ${typeof(data.searchText)}`)
    if (data.searchText == "") {
      throw new BadRequestException('Empty string')
    }
    const stringSql = `'%${data.searchText}%'`
    /**megnézzük, hogy a tömb csak szamokat tartalmaz e */
    /**ha nincs allergen */
    if (data.selectedAllergens == null) {
      const respones = this.db.$queryRaw`SELECT r.id, r.title, r.description, r.preptime, r.posted, AVG(ratings.rating) AS rating FROM recipes AS r INNER JOIN recipe_allergens ON r.id = recipe_id INNER JOIN allergens ON recipe_allergens.allergen_id = allergens.id INNER JOIN ratings ON r.id = ratings.recipe_id WHERE r.title LIKE ${stringSql} OR r.description LIKE ${stringSql};`
      return respones
    }
    const checkedArray: number[] = this.arrayChecker(data.selectedAllergens)
    /**ha van allergen = 1 */
    if (data.selectedAllergens.length == 1) {
      const respones = this.db.$queryRaw`SELECT r.id, r.title, r.description, r.preptime, r.posted, AVG(ratings.rating) AS rating FROM recipes AS r INNER JOIN recipe_allergens ON r.id = recipe_id INNER JOIN allergens ON recipe_allergens.allergen_id = allergens.id INNER JOIN ratings ON r.id = ratings.recipe_id WHERE r.title LIKE ${stringSql} OR r.description LIKE ${stringSql} AND allergens.id NOT ${checkedArray[0]};`
      return respones
    }
    /**mysql formatumhoz stringgé csináljuk az array */
    const arrayString: string = this.arrayToString(checkedArray)
    /**ha van allergen > 1 */
    const respones = this.db.$queryRaw`SELECT r.id, r.title, r.description, r.preptime, r.posted, AVG(ratings.rating) AS rating FROM recipes AS r INNER JOIN recipe_allergens ON r.id = recipe_id INNER JOIN allergens ON recipe_allergens.allergen_id = allergens.id INNER JOIN ratings ON r.id = ratings.recipe_id WHERE r.title LIKE ${stringSql} OR r.description LIKE ${stringSql} AND allergens.id NOT IN ${arrayString};`
    return respones
  }

  /**
   * tömb ellenörző
   * @param array allergen listája
   * @returns ugyanazt az any array de az ellenörőn átment
   */
  arrayChecker(array: any[]) {
    for (let i = 0; i < array.length; i++) {
      if (!Number(array[i])) {
        throw new BadRequestException('Array contains something other than numbers')
      }
    }
    return array
  }

  /**
   * mysql not in kellően string converter
   * @param array allergen listája
   * @returns a helyes megformázott string
   */
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

  /**
   * az updatenál kitörölenő allergens id a kapcsolótablából
   * @param id recept id-ja
   * @param removedAllergens kitörölendő id-k
   */
  RemovedAllergens(id: number, removedAllergens: number[]) {
    this.connectTable.delete(id, removedAllergens)
  }

  /**
   * az updatenál hozzáadandó allergens id a kapcsolótablából
   * @param id recept id-ja
   * @param createAllergens hozzáadandó id-k
   */
  CreateAllergens(id: number, createAllergens: number[]) {
    createAllergens.forEach(element => {
      this.connectTable.create(id, element)
    });
  }
}
