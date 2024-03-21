import { IsDateString, IsEmpty, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from "class-validator";

/**
 * recipes dto, create
 */
export class CreateRecipeDto {
  /**a recept címe */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string

  /**a recepthez tartozó rövid leírás */
  @IsString()
  @MaxLength(300)
  description: string

  /**a recept leírása */
  @IsString()
  @IsNotEmpty()
  content: string

  /**a recept elkészítéséhez tartozó idő percben*/
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  preptime: number

  /**timestamp arról hogy mikor postolták a receptet */
  @IsDateString()
  @IsEmpty()
  posted: string

  /**postoló id-ja */
  @IsInt()
  @IsNotEmpty()
  user_id: number

  /**a recepthez tartozo allergen id-ja */
  @IsNotEmpty()
  @IsNumber()
  allergens: number[]
}
