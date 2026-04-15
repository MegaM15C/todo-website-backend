import { DEFAULT_FACTORY_CLASS_METHOD_KEY } from "@nestjs/common/module-utils/constants";
import { ApiIAmATeapotResponse, ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
    @ApiProperty({
        description: "Название задачи",
        example: "Сходить на IT встречу"
    })
    @IsString()
    title: string;

    @ApiProperty({
        description: "Описание задачи",
        example: 'Встреча будет по адресу...'
    })
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty({
        description: "Картинка задачи",
        type: 'file',
        format: 'binary',
        required: true
    })
    @IsOptional()
    photo?: any;
}

export class UpdateTaskDto {
    @ApiProperty({
        description: "Название задачи",
        example: "Сходить на IT встречу",
        required: false
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({
        description: "Описание задачи",
        example: 'Встреча будет по адресу...',
        required: false
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: "Картинка задачи",
        type: 'file',
        format: 'binary',
        required: false
    })
    @IsOptional()
    photo?: any;

    @ApiProperty({
        description: "Выполнена задача или нет",
        example: true,
        required: false
    })
    @IsOptional()
    @IsBoolean()
    done?: boolean
}