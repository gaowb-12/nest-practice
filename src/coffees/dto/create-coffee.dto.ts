import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"
export class CreateCoffeeDto {
    @ApiProperty({description:"咖啡名称"})
    @IsString()
    readonly name: string

    @ApiProperty({description:"咖啡品牌"})
    @IsString()
    readonly brand: string

    @ApiProperty({example:[]})
    @IsString({each: true})
    readonly flavors: string[]
}
