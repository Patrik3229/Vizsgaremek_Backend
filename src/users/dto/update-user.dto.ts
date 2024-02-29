import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

/**
 * update, delete kellendők extra adatok
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  /**user id, az update van mert auto generated */
  @IsNumber()
  @IsNotEmpty()
  id: number
}
