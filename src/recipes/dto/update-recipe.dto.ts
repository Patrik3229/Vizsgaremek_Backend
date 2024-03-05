import { PartialType } from '@nestjs/mapped-types';
import { CreateRecipeDto } from './create-recipe.dto';
import { IsEmpty, IsNotEmpty, IsNumber } from 'class-validator';
import { Optional } from '@nestjs/common';

export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {
  @IsNumber()
  @IsNotEmpty()
  id: number

  @Optional()
  content?: string;

  @Optional()
  description?: string;

  @Optional()
  preptime?: number;

  @Optional()
  title?: string;

  @IsEmpty()
  posted?: string;

  @IsEmpty()
  user_id?: number;
}
