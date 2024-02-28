import { PartialType } from '@nestjs/mapped-types';
import { CreateRatingDto } from './create-rating.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateRatingDto extends PartialType(CreateRatingDto) {
  @IsNumber()
  @IsNotEmpty()
  id: number
}
