import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AllergensService } from './allergens.service';

@Controller('allergens')
export class AllergensController {
  constructor(private readonly allergensService: AllergensService) { }

  /**
   * összes allergen kilistázása
   * @returns listát az allergénekről
   */
  @Get('all')
  findAll() {
    return this.allergensService.findAll();
  }

  /**
   * egy specifikus allergen megkeresése
   * @param id allegen id
   * @returns az allergene adatait
   */
  @Get('find:id')
  findOne(@Param('id') id: string) {
    return this.allergensService.findOne(+id);
  }

  /**
   * egy recepthez tartozó allergének megkeresée
   * @param id receőt id-ja
   * @returns allergen nevéből álló listát
   */
  @Get('find-recipe/:id')
  findrecipe(@Param('id') id:string){
    return this.allergensService.findRecipeAllergen(+id);
  }
}
