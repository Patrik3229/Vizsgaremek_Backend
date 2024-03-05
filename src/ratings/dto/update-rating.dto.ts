import { PartialType } from '@nestjs/mapped-types';
import { CreateRatingDto } from './create-rating.dto';
import { IsEmpty, IsNotEmpty, IsNumber } from 'class-validator';
import { Optional } from '@nestjs/common';

export class UpdateRatingDto extends PartialType(CreateRatingDto) {
  @IsNumber()
  @IsNotEmpty()
  id: number
  
  @Optional()
  content?: string;

  @IsEmpty()
  posted?: string;

  @Optional()
  rating?: number;

  @IsEmpty()
  recipe_id?: number;

  @IsEmpty()
  user_id?: number;
}
