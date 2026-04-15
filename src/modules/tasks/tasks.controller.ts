import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UploadedFile, UseInterceptors, UnauthorizedException, Query, HttpCode } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task-requests.dto';
import { Task, TaskBadReq, TaskNotFound } from './dto/task-response.dto';
import { JwtAuthGuard } from 'src/common/guards/bearer-auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UnauthorizedError } from '../auth/dto/auth-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { NotFoundError } from '../users/dto/user-response.dto';
import { FileValidationPipe } from 'src/common/validators/file-validation';
import { updateUserDto } from '../users/dto/user-requests.dto';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }


  @ApiOperation({ summary: "Создание задачи" })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    type: Task,
    description: "Задача успешно создана"
  })
  @ApiResponse({
    status: 400,
    type: TaskBadReq,
    description: "Неверный запрос"
  })
  @ApiResponse({
    status: 401,
    type: UnauthorizedError,
    description: "Пользователь не авторизован"
  })
  @UseInterceptors(FileInterceptor('photo'))
  @Post()
  async create(
    @Req() req: any,
    @Body() createTaskDto: CreateTaskDto,
    @UploadedFile(FileValidationPipe) file: Express.Multer.File
  ) {
    console.log(req.user.userId)
    return await this.tasksService.create(req.user.userId, file, createTaskDto);
  }

  @ApiOperation({ summary: "Получение всех своих задач" })
  @ApiResponse({
    status: 200,
    type: Task,
    isArray: true,
    description: "Успешный вывод задач"
  })
  @ApiResponse({
    status: 401,
    type: UnauthorizedError,
    description: "Пользователь не авторизован"
  })
  @Get('my-tasks')
  async findAll(
    @Query('take') take: number,
    @Query('skip') skip: number,
    @Req() req: any
  ) {
    return this.tasksService.findAll(req.user.userId, take, skip);
  }

  @ApiOperation({ summary: "Получение задачи по Id" })
  @ApiResponse({
    status: 200,
    type: Task,
    isArray: true,
    description: "Успешный вывод задачи"
  })
  @ApiResponse({
    status: 401,
    type: UnauthorizedError,
    description: "Пользователь не авторизован"
  })
  @ApiResponse({
    status: 404,
    type: TaskNotFound,
    description: "Задача не найдена"
  })
  @Get(':id')
  async findOne(
    @Param('id') taskId: string,
    @Req() req: any
  ) {
    return await this.tasksService.findOne(req.user.userId, taskId);
  }

  @ApiOperation({ summary: "Обновление задачи по Id" })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    type: Task,
    isArray: true,
    description: "Успешный вывод задачи"
  })
  @ApiResponse({
    status: 401,
    type: UnauthorizedError,
    description: "Пользователь не авторизован"
  })
  @ApiResponse({
    status: 404,
    type: TaskNotFound,
    description: "Задача не найдена"
  })
  @UseInterceptors(FileInterceptor('photo'))
  @Patch(':id')
  async update(
    @Param('id') taskId: string,
    @Req() req: any,
    @Body() updateTaskDto: UpdateTaskDto,
    @UploadedFile(FileValidationPipe) photo: Express.Multer.File
  ) {
    return this.tasksService.update(taskId, updateTaskDto, photo, req.user.userId);
  }


  @ApiOperation({ summary: "Удаление задачи по Id" })
  @ApiResponse({
    status: 204,
    description: "Успешное удаление задачи"
  })
  @ApiResponse({
    status: 401,
    type: UnauthorizedError,
    description: "Пользователь не авторизован"
  })
  @ApiResponse({
    status: 404,
    type: TaskNotFound,
    description: "Задача не найдена"
  })
  @HttpCode(204)
  @Delete(':id')
  async remove(
    @Param('id') taskId: string,
    @Req() req: any,
  ) {
    return await this.tasksService.remove(taskId, req.user.userId);
  }
}
