import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class AllergensService {
  constructor(private readonly db: PrismaService) { }

  /**
   * összes allergen visszaad
   * @returns allergen lista
   */
  findAll() {
    return this.db.allergens.findMany();
  }

  /**
   * id szerinti keresés
   * @param id allergen id
   * @returns allergen adatokat
   */
  findOne(id: number) {
    return this.db.allergens.findUnique({
      where: { id }
    });
  }

  /**
   * nev szerint keresés
   * @param name allergen string
   * @returns az allergen id
   */
  findbyName(name: string) {
    return this.db.allergens.findMany({
      where: {
        name: {
          contains: name
        }
      },
      select: {
        id: true
      }
    })
  }

  findRecipeAllergen(id : number){
    return this.db.$queryRaw`SELECT name FROM Allergens INNER JOIN recipe_allergens ON allergens.id = allergen_id INNER JOIN recipes ON recipe_allergens.recipe_id = recipes.id WHERE recipes.id = ${id}`
  }
}
