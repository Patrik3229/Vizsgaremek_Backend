import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { Optional } from "@nestjs/common";
import { IsNotEmpty, IsNumber } from "class-validator";
/**
 * Az update Adminhoz használt dto
 */
export class UpdateAdminDto extends PartialType(CreateUserDto){
    /**email-je a usernek */
    @Optional()
    email?: string;

    /**user felhasználó neve */
    @Optional()
    username?: string;

    /**user jelszava */
    @Optional()
    password?: string;

    @IsNotEmpty()
    @IsNumber()
    id : number
}