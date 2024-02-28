import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAllergenDto {
  @IsNumber()
  @IsNotEmpty()
  id: number
  
  @IsString()
  @IsNotEmpty()
  name: string
}
