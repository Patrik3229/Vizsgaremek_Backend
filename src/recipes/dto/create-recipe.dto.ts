import { IsDateString, IsEmpty, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  description: string

  @IsString()
  @IsNotEmpty()
  content: string

  @IsNumber()
  @IsNotEmpty()
  preptime: number

  @IsDateString()
  @IsEmpty()
  posted: string

  @IsInt()
  @IsNotEmpty()
  user_id: number
}
