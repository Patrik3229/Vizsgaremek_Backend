import { IsNotEmpty, IsString } from "class-validator";

export class CreateAllergenDto {
  @IsString()
  @IsNotEmpty()
  name: string
}
