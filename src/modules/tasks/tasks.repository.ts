import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task-requests.dto';
import { updateUserDto } from '../users/dto/user-requests.dto';

@Injectable()
export class TaskRepository {
    constructor(private readonly prisma: PrismaService) { }
    async create(
        createTaskDto: CreateTaskDto,
        userId: string,
        imageUrl: string,
    ) {
        return await this.prisma.task.create({
            data: {
                userId: userId,
                title: createTaskDto.title,
                description: createTaskDto.description,
                imageUrl: imageUrl
            },
            select: {
                id: true,
                title: true,
                description: true,
                imageUrl: true,
                done: true
            }
        })
    }

    async findAll(
        userId: string,
        take: number,
        skip: number
    ) {
        return await this.prisma.task.findMany({
            where: { userId: userId },
            take: take,
            skip: skip,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                description: true,
                imageUrl: true,
                done: true
            }
        })
    }
    async findOne(
        userId: string,
        taskId: string
    ) {
        return await this.prisma.task.findUnique({
            where: {
                id: taskId,
                userId: userId
            },
            select: {
                id: true,
                title: true,
                description: true,
                imageUrl: true,
                done: true
            }
        })
    }
    async update(
        taskId: string,
        userId: string,
        imageUrl: string,
        updateTaskDto: UpdateTaskDto
    ) {
        return await this.prisma.task.update({
            where: { id: taskId, userId: userId },
            data: {
                title: updateTaskDto.title,
                description: updateTaskDto.description,
                done: updateTaskDto.done,
                imageUrl: imageUrl
            },
            select: {
                id: true,
                title: true,
                description: true,
                imageUrl: true,
                done: true
            }
        })
    }

    async remove(
        taskId: string,
        userId: string,
    ) {
        return await this.prisma.task.delete({
            where: {
                id: taskId,
                userId: userId
            }
        })
    }
}