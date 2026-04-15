import { ApiProperty } from "@nestjs/swagger";

export class GiveAccessToken {
    @ApiProperty({
        description: 'accessToken необходимый для запросов',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    })
    accessToken: string
}

export class ConflictExistingUserResponseDto {
    @ApiProperty({
        description: 'Сообщение об ошибке',
        example: 'User is already registered',
    })
    message: string = 'User is already registered';
}


export class NotFoundUserResponseDto {
    @ApiProperty({
        description: 'Сообщение об ошибке',
        example: 'User not found',
    })
    message: string = 'User not found';
}

export class InvalidCredentialsResponseDto {
    @ApiProperty({
        description: 'Сообщение об ошибке',
        example: 'Invalid credentials',
    })
    message: string = 'Invalid credentials';
}

export class UnauthorizedError {
    @ApiProperty({
        description: 'Сообщение об ошибке',
        example: 'Unauthorized',
    })
    message: string = 'Unauthorized'
}