import { IsNotEmpty, IsString } from "class-validator"

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  password: string
  
  @IsString()
  @IsNotEmpty()
  passwordAgain: string

  @IsString()
  @IsNotEmpty()
  role: string
}
