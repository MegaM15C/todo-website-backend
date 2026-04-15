import { ApiProperty } from "@nestjs/swagger";
import { NotFoundUserResponseDto } from "src/modules/auth/dto/auth-response.dto";

export class ForbiddenError {
    @ApiProperty({
        description: 'Сообщение об ошибки',
        example: "You don't have a permission"
    })
    message: string;
}

import { IsEmail, IsString, IsOptional, IsEnum, isString } from 'class-validator'
import { Timestamp } from "rxjs";

export class UserDto {
    @ApiProperty({
        description: 'Id пользователя',
        example: '7dd19faa-1e03-4441-881d-2df10f3ccdcd'
    })
    @IsString()
    id: string

    @ApiProperty({
        description: 'Почта пользователя',
        example: 'user@example.com'
    })
    @IsEmail()
    email: string

    @ApiProperty({
        description: 'Имя пользователя',
        example: 'John'
    })
    @IsOptional()
    @IsString()
    name: string | null


    @ApiProperty({
        description: 'Роль пользователя',
        example: 'USER'
    })
    @IsEnum(['USER', 'ADMIN'])
    role: 'USER' | 'ADMIN';

    @ApiProperty({
        description: 'Дата регистрации пользователя',
        example: '2026-04-11T17:32:29.421Z'
    })
    created_at: string;

    @ApiProperty({
        description: 'Дата последнего обновления данных пользователя',
        example: '2026-04-12T12:39:46.668Z'
    })
    @IsOptional()
    updated_at: string | null
}

export class NotFoundError extends NotFoundUserResponseDto { }