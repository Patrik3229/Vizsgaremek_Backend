import { IsDateString, IsEmpty, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator"

/**
 * rating dto a create-nél
 */
export class CreateRatingDto {
  /**a postoló id-ja */
  @IsNumber()
  @IsNotEmpty()
  user_id: number

  /**annak a receptnek az id ahová comment-el */
  @IsNumber()
  @IsNotEmpty()
  recipe_id: number

  /**rating értéke */
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number

  /**a rating tartozó comment */
  @IsString()
  content: string

  /**a timestamp animkor postolta, üres */
  @IsDateString()
  @IsEmpty()
  posted: string
}
