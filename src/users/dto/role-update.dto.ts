import { PartialType } from "@nestjs/mapped-types";
import { UpdateUserDto } from "./update-user.dto";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
/**
 * role change-hez használt dto
 */
export class roleUpdateDto extends PartialType(UpdateUserDto){
    /**user id-ja */
    @IsNumber()
    @IsNotEmpty()
    id?: number;

    /**user új role-ja */
    @IsString()
    @IsNotEmpty()
    role?: string;
}