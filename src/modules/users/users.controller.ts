import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, HttpCode, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiResetContentResponse, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/bearer-auth.guard';
import { ForbiddenError, NotFoundError, UserDto, } from './dto/user-response.dto';
import { updateUserDto } from './dto/user-requests.dto';
import { UnauthorizedError } from '../auth/dto/auth-response.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({ summary: "Обновление информации о пользователе" })
  @ApiResponse({
    status: 200,
    type: UserDto,
    description: "Вывод информации о пользователе"
  })
  @ApiResponse({
    status: 401,
    type: UnauthorizedError,
    description: 'Необходима авторизация'
  })
  @ApiResponse({
    status: 404,
    type: NotFoundError,
    description: "Пользователь не найден"
  })
  @Patch()
  update(
    @Req() req: any,
    @Body() updateUserDto: updateUserDto) {
    return this.usersService.update(req.user.userId, updateUserDto);
  }


  @ApiOperation({ summary: "Получение информации о всех пользователях" })
  @ApiResponse({
    status: 200,
    type: UserDto,
    isArray: true,
    description: "Вывод информации о пользователях"
  })
  @ApiResponse({
    status: 401,
    type: UnauthorizedError,
    description: 'Необходима авторизация'
  })
  @ApiResponse({
    status: 403,
    type: ForbiddenError,
    description: "Нет доступа"
  })
  @Get()
  findAll(
    @Query('take') take: number = 50,
    @Query('skip') skip: number = 0,
    @Req() req: any
  ) {
    return this.usersService.findAll(take, skip, req.user);
  }


  @ApiOperation({ summary: "Получение информации о себе" })
  @ApiResponse({
    status: 200,
    type: UserDto,
    description: "Вывод информации о пользователе"
  })
  @ApiResponse({
    status: 401,
    type: UnauthorizedError,
    description: 'Необходима авторизация'
  })
  @ApiResponse({
    status: 404,
    type: NotFoundError,
    description: "Пользователь не найден"
  })
  @Get('profile')
  findMe(
    @Req() req: any
  ) {
    return this.usersService.findMyself(req.user.userId);
  }


  @ApiOperation({ summary: "Получение информации о пользователе" })
  @ApiResponse({
    status: 200,
    type: UserDto,
    description: "Вывод информации о пользователе"
  })
  @ApiResponse({
    status: 401,
    type: UnauthorizedError,
    description: 'Необходима авторизация'
  })
  @ApiResponse({
    status: 403,
    type: ForbiddenError,
    description: "Нет доступа"
  })
  @ApiResponse({
    status: 404,
    type: NotFoundError,
    description: "Пользователь не найден"
  })
  @Get('by-id/:id')
  findOne(
    @Param('id') id: string,
    @Req() req: any
  ) {
    return this.usersService.findOne(id, req.user);
  }


  @ApiOperation({ summary: "Удаление пользователя" })
  @ApiResponse({
    status: 204,
    description: "Пользователь удален"
  })
  @ApiResponse({
    status: 401,
    type: UnauthorizedError,
    description: 'Необходима авторизация'
  })
  @ApiResponse({
    status: 403,
    type: ForbiddenError,
    description: "Нет доступа"
  })
  @ApiResponse({
    status: 404,
    type: NotFoundError,
    description: "Пользователь не найден"
  })
  @Delete(':id')
  @HttpCode(204)
  remove(
    @Req() req: any,
    @Param('id') id: string
  ) {
    return this.usersService.remove(id, req);
  }
}
