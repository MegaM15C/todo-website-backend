import { PipeTransform } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FileValidationPipe implements PipeTransform {
    transform(value: Express.Multer.File) {
        if (!value) {
            throw new BadRequestException({message: 'File is required'});
        }

        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedMimes.includes(value.mimetype)) {
            throw new BadRequestException({message: "Unsupported filetype"});
        }

        if (value.size > 5 * 1024 * 1024) { // 5MB
            throw new BadRequestException({message: "File is too big"});
        }

        return value;
    }
}