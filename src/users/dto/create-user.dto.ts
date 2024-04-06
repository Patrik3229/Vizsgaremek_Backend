import { IsEmpty, IsNotEmpty, IsString } from "class-validator"
/**
 * User registration haszálandó dto
 */
export class CreateUserDto {
  /**user email-je */
  @IsString()
  @IsNotEmpty()
  email: string

  /**user neve */
  @IsString()
  @IsNotEmpty()
  username: string

  /**user jelszava */
  @IsString()
  @IsNotEmpty()
  password: string
  
  /**user jelszava újra az ellenőrzéshez */
  @IsString()
  @IsNotEmpty()
  passwordAgain: string

  // /**user rankja alapértelmezett sima 'user' */
  // @IsEmpty()
  // role: string
}
