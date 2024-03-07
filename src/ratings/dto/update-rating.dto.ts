import { PartialType } from '@nestjs/mapped-types';
import { CreateRatingDto } from './create-rating.dto';
import { IsEmpty, IsNotEmpty, IsNumber } from 'class-validator';
import { Optional } from '@nestjs/common';

/**
 * rating dto update
 */
export class UpdateRatingDto extends PartialType(CreateRatingDto) {
  /**a rating a id-ja */
  @IsNumber()
  @IsNotEmpty()
  id: number
  
  /**ratinghez tartozó comment*/
  @Optional()
  content?: string;

  /**timestamp arról hogy mikor frissült */
  @IsEmpty()
  posted?: string;

  /**az új ratingnek az értéke */
  @Optional()
  rating?: number;

  /**recept id amihez tartozik a rating */
  @IsEmpty()
  recipe_id?: number;

  /**a postoló id-ja*/
  @IsEmpty()
  user_id?: number;
}
