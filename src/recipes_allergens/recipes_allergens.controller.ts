import { Controller } from '@nestjs/common';
import { RecipesAllergensService } from './recipes_allergens.service';

@Controller('recipes-allergens')
export class RecipesAllergensController {
  constructor(private readonly recipesAllergensService: RecipesAllergensService) {}
}
