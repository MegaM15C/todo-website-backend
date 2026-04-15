import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TaskRepository } from './tasks.repository';
import { S3Service } from 'src/common/s3/s3.service';

@Module({

  controllers: [TasksController],
  providers: [TasksService, TaskRepository, S3Service],
})
export class TasksModule { }
