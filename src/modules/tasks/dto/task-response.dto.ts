import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString, isString } from "class-validator";

export class Task {
    @ApiProperty({
        description: 'Id задачи',
        example: '08ea6b0a-9741-4240-bab8-f969789a35b6'
    })
    @IsString()
    id: string;

    @ApiProperty({
        description: "Название задачи",
        example: 'Сходить на IT встречу'
    })
    @IsString()
    title: string;

    @ApiProperty({
        description: "Описание задачи",
        example: "Встреча находится по адресу..."
    })
    @IsString()
    description: string;

    @ApiProperty({
        description: "URL-адрес фото задачи",
        example: "https://s3.twcstorage.ru/..."
    })
    @IsString()
    imageUrl: string;

    @ApiProperty({
        description: 'Выполнение задачи',
        example: true
    })
    @IsBoolean()
    done: boolean
}

export class TaskNotFound {
    @ApiProperty({
        description: 'Сообщение об ошибке',
        example: 'Task not found',
    })
    message: string = 'Task not found';
}

export class TaskBadReq {
    @ApiProperty({
        description: "Сообщение об ошибке валидации",
        type: 'string',
        examples: [
            'File is required',
            'Unsupported filetype',
            'File is too big'
        ]
    })
    message: string;

}