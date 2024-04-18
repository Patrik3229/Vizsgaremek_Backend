import { Optional } from "@nestjs/common"
import { IsNotEmpty, IsString } from "class-validator"

export class Search{
    @IsNotEmpty()
    @IsString()
    searchText: string

    @Optional()
    selectedAllergens: number[]
}