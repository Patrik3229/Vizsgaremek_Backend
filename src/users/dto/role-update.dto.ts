import { PartialType } from "@nestjs/mapped-types";
import { UpdateUserDto } from "./update-user.dto";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class roleUpdateDto extends PartialType(UpdateUserDto){
    @IsNumber()
    @IsNotEmpty()
    id?: number;

    @IsString()
    @IsNotEmpty()
    role?: string;
}