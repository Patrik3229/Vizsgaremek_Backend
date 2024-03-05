import { IsDateString, IsEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateRatingDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number

  @IsNumber()
  @IsNotEmpty()
  recipe_id: number

  @IsNumber()
  @IsNotEmpty()
  rating: number

  @IsString()
  content: string

  @IsDateString()
  @IsEmpty()
  posted: string
}
