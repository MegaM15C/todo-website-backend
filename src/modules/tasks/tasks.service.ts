import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './dto/task-requests.dto';
import { TaskRepository } from './tasks.repository';
import { S3Service } from 'src/common/s3/s3.service';
import { Express } from 'express';
import { NotFound } from '@aws-sdk/client-s3';
import { takeLast } from 'rxjs';

@Injectable()
export class TasksService {
  constructor(
    private readonly taskRepo: TaskRepository,
    private readonly s3: S3Service,
  ) { }
  async create(
    userId: string,
    image: Express.Multer.File,
    createTaskDto: CreateTaskDto,
  ) {
    const imageFilename = this.s3.generateFilename(image.originalname)
    const imageUrl = await this.s3.uploadFile(image.buffer, imageFilename)
    try {
      return await this.taskRepo.create(createTaskDto, userId, imageUrl);
    }
    catch {
      await this.s3.deleteFileByUrl(imageUrl)
      throw new InternalServerErrorException()
    }
  }

  async findAll(
    userId: string,
    take: number,
    skip: number
  ) {
    return await this.taskRepo.findAll(userId, take, skip);
  }

  async findOne(
    userId: string,
    taskId: string,
  ) {
    return await this.taskRepo.findOne(userId, taskId);
  }

  async update(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
    photo: Express.Multer.File,
    userId: string
  ) {
    const taskDb = await this.taskRepo.findOne(userId, taskId)
    if (!taskDb) {
      throw new NotFoundException({ message: "Task not found" })
    }
    if (taskDb.imageUrl) {
      await this.s3.deleteFileByUrl(taskDb.imageUrl)
    }
    const imageFilename = this.s3.generateFilename(photo.originalname)
    const imageUrl = await this.s3.uploadFile(photo.buffer, imageFilename)
    try {
      return await this.taskRepo.update(taskId, userId, imageUrl, updateTaskDto);
    }
    catch {
      await this.s3.deleteFileByUrl(imageUrl)
      throw new InternalServerErrorException()
    }

  }

  async remove(
    taskId: string,
    userId: string
  ) {
    const taskDb = await this.taskRepo.findOne(userId, taskId)
    if (!taskDb) {
      throw new NotFoundException({ message: "Task not found" })
    }
    if (taskDb.imageUrl) {
      await this.s3.deleteFileByUrl(taskDb.imageUrl)
    }
    await this.taskRepo.remove(taskId, userId)
    return;
  }
}
