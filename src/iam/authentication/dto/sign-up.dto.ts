import { ApiProperty } from "@nestjs/swagger"
import { IsString, MinLength } from "class-validator"

export class SignUpDto {
    @ApiProperty({description:"用户名"})
    @IsString()
    readonly username: string

    @ApiProperty({description:"密码"})
    @IsString()
    @MinLength(10)
    readonly password: string
}
