import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Optional } from '@nestjs/common';

/**
 * update, delete kellendők extra adatok
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  /**user id, az update van mert auto generated */
  @IsNumber()
  @IsNotEmpty()
  id: number

  /**a user régi jelszó */
  @Optional()
  passwordOld: string

  @Optional()
  username?: string;

  @Optional()
  email?: string;

  @Optional()
  password?: string;

  @Optional()
  passwordAgain?: string;

  @Optional()
  role?: string;
}
