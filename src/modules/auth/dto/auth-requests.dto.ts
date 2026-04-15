import { IsEmail, IsString, Length, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
    @ApiProperty({ example: 'user@example.com'})
    @IsEmail()
    email: string;

    @ApiProperty({example: '12345678'})
    @MinLength(8)
    password: string;
}
