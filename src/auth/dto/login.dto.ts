import { IsString } from "class-validator";
/**
 * Login haszálandó dto
 */
export class LoginDto {
  /** user eamil-je*/
  @IsString()
  email: string;
  /**user jelszava (begépelt, nem titkosított) */
  @IsString()
  password: string;
}
