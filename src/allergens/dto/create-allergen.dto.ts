import { IsNotEmpty, IsNumber, IsString } from "class-validator";

/**
 * allergens dto-ja, nincs create funkció itt
 */
export class CreateAllergenDto {
  /**az allergen id */
  @IsNumber()
  @IsNotEmpty()
  id: number
  
  /**az allergen neve*/
  @IsString()
  @IsNotEmpty()
  name: string
}
