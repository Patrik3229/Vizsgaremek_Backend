import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RecipesAllergensService {
    constructor(private readonly db : PrismaService){}

    create(recipe : number, allergen : number){
        this.db.recipe_Allergens.create({
            data : {
                allergen_id : allergen,
                recipe_id : recipe
            }
        })
    }

    delete(recipe : number, allergens : number[]){
        this.db.recipe_Allergens.deleteMany({
            where: {
                allergen_id: {
                  in : allergens
                },
                AND: {
                  recipe_id: recipe
                }
              }
        })
    }
}
