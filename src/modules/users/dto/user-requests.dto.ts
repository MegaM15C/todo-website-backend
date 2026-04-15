import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";


export class updateUserDto {
    @ApiProperty({
        description: 'Имя пользователя',
        example: 'Alex'
    })
    @IsOptional()
    @IsString()
    name: string;
}