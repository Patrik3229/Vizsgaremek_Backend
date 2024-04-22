import { BadRequestException, GoneException, Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PrismaService } from 'src/prisma.service';
import { AllergensService } from 'src/allergens/allergens.service';
import { RecipesAllergensService } from 'src/recipes_allergens/recipes_allergens.service';
import { Search } from './dto/search-class';
import { Prisma } from '@prisma/client';

@Injectable()
export class RecipesService {
  constructor(private readonly db: PrismaService, private readonly allergen: AllergensService, private readonly connectTable: RecipesAllergensService) { }

  /**
   * új recept poszt csinál
   * @param createRecipeDto a user altal bekuldott adatok, a body talalhato adatok
   * @returns új receptet ad vissza
   */
  async create(id: number, createRecipeDto: CreateRecipeDto) {
    const chechedAllergens: number[] = this.arrayChecker(createRecipeDto.allergens)
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
      data: chechedAllergens.map(a => ({
        allergen_id: a,
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
    return await this.db.$queryRaw`SELECT r.id, r.title, r.description, r.preptime, r.posted, GROUP_CONCAT(allergens.name ORDER BY allergens.name SEPARATOR ', ') AS allergen_names, GROUP_CONCAT(allergens.id ORDER BY allergens.id SEPARATOR ',') AS allergen_ids FROM recipes AS r LEFT JOIN recipe_allergens ON r.id = recipe_allergens.recipe_id LEFT JOIN allergens ON recipe_allergens.allergen_id = allergens.id WHERE r.user_id = ${id} GROUP BY r.id, r.title, r.description, r.preptime, r.posted;`
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
    if (updateRecipeDto.allergens != null && updateRecipeDto.allergens.length != 0) {
      const results = await this.db.recipe_Allergens.findMany({
        where: {
          recipe_id: id
        },
        select: {
          allergen_id: true
        }
      });

      const currentAllergens = results.map(x => x.allergen_id);
      const allergensToRemove = currentAllergens.filter(x => !updateRecipeDto.allergens.includes(x));
      const allergensToAdd = updateRecipeDto.allergens.filter(x => !currentAllergens.includes(x));

      if (allergensToRemove.length > 0) {
        await this.RemovedAllergens(id, allergensToRemove); // Assuming this method deletes allergens
      }
      if (allergensToAdd.length > 0) {
        await this.CreateAllergens(id, allergensToAdd); // Assuming this method adds allergens
      }
    }

    return await this.db.recipes.update({
      where: { id },
      data: {
        title: updateRecipeDto.title,
        description: updateRecipeDto.description,
        content: updateRecipeDto.content,
        posted: new Date().toISOString(),
        preptime: updateRecipeDto.preptime
      }
    });
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
  async searchContent(data: Search) {
    if (data.searchText === "") {
      throw new BadRequestException('Empty string');
    }

    const searchText = `%${data.searchText}%`;
    const selectedAllergens = data.selectedAllergens;
    let allergenCondition = '';

    // Only create the allergen condition if there are allergens to exclude
    if (selectedAllergens && selectedAllergens.length > 0) {
      const allergensNotIn = selectedAllergens.map(id => `${id}`).join(', ');  // Map and join the allergens array
      allergenCondition = `AND NOT EXISTS (
            SELECT 1 FROM recipe_allergens ra
            WHERE ra.recipe_id = r.id
            AND ra.allergen_id IN (${allergensNotIn})
        )`;
    }

    try {
      const response = await this.db.$queryRaw`
      SELECT r.id, r.title, r.description, r.preptime, r.posted, CAST(AVG(ratings.rating) AS FLOAT) AS rating
      FROM recipes AS r
      INNER JOIN ratings ON r.id = ratings.recipe_id
      WHERE (r.title LIKE ${searchText})
      ${Prisma.raw(allergenCondition)}
      GROUP BY r.id, r.title, r.description, r.preptime, r.posted;
      `;

      console.log("Query successful: ", response);
      return response;
    } catch (error) {
      console.error("Query failed: ", error);
      throw new BadRequestException('Query execution failed');
    }
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

  checker(string : string) {
    const s = string.toUpperCase().trim()
    if(s.includes("SELECT")){
      return false
    }
    if(s.includes("INSERT")){
      return false
    }
    if(s.includes("UPDATE")){
      return false
    }
    if(s.includes("DROP")){
      return false
    }
    if(s.includes("DELETE")){
      return false
    }
    if(s.includes("CREATE")){
      return false
    }
    return true
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
  async RemovedAllergens(recipeId: number, allergensToRemove: number[]) {
    await this.db.recipe_Allergens.deleteMany({
      where: {
        recipe_id: recipeId,
        allergen_id: { in: allergensToRemove }
      }
    });
  }

  /**
   * az updatenál hozzáadandó allergens id a kapcsolótablából
   * @param id recept id-ja
   * @param createAllergens hozzáadandó id-k
   */
  async CreateAllergens(recipeId: number, allergensToAdd: number[]) {
    const allergenData = allergensToAdd.map(allergenId => ({
      recipe_id: recipeId,
      allergen_id: allergenId
    }));

    await this.db.recipe_Allergens.createMany({
      data: allergenData
    });
  }
}
