import { PartialType } from '@nestjs/mapped-types';
import { CreateRecipeDto } from './create-recipe.dto';
import { IsEmpty, IsNotEmpty, IsNumber } from 'class-validator';
import { Optional } from '@nestjs/common';

/**
 * recipes dto, update
 */
export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {
  /**recept id-ja */
  @IsNumber()
  @IsNotEmpty()
  id: number

  /**frissítendő tartalom */
  @Optional()
  content?: string;

  /**frisítendő rövid leírás */
  @Optional()
  description?: string;

  /**a frissítendő elkészítési idő */
  @Optional()
  preptime?: number;

  /**a frissitendő cím */
  @Optional()
  title?: string;

  /**timestamp a frisített időhez */
  @IsEmpty()
  posted?: string;

  /**a user id akihez tartozik a recept */
  @IsEmpty()
  user_id?: number;
}
