import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Res,
  Req,
  UseGuards
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto, } from './dto/auth-requests.dto';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RefreshAuth } from 'src/common/guards/jwt-auth.decorator';
import { ConflictExistingUserResponseDto, GiveAccessToken, InvalidCredentialsResponseDto, NotFoundUserResponseDto, UnauthorizedError } from './dto/auth-response.dto';
import { JwtAuthGuard } from 'src/common/guards/bearer-auth.guard';
import { RefreshTokenGuard } from 'src/common/guards/jwt-auth.guard';


@ApiTags("Authorization")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({
    status: 200,
    type: GiveAccessToken,
    description: 'Пользователь успешно зарегистрирован'
  })
  @ApiResponse({
    status: 209,
    type: ConflictExistingUserResponseDto,
    description: 'Пользователь с таким email уже зарегистрирован'
  })

  @Post('register')
  async register(
    @Body() AuthDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.RegistrationUser(AuthDto, res);
  }

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({
    status: 200,
    type: GiveAccessToken,
    description: 'Пользователь успешно авторизовался',
  })
  @ApiResponse({
    status: 401,
    type: InvalidCredentialsResponseDto,
    description: 'Неверный пароль/логин'
  })

  @Post("login")
  async logIn(
    @Body() logInDto: AuthDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.logIn(logInDto, res)
  }


  @ApiOperation({
    summary: "Обновление access_token"
  })
  @ApiResponse({
    status: 200,
    description: "Обновляет access_token по refresh",
  })
  @ApiResponse({
    status: 401,
    type: UnauthorizedError,
    description: 'Пользователь не авторизован через Cookie'
  })
  @ApiCookieAuth()
  @RefreshAuth()
  @Patch('/updateToken')
  async updateAccessToken(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request
  ) {
    return this.authService.refreshAccessToken(req, res);
  }

  @ApiOperation({
    summary: "Выход из сессии"
  })
  @ApiResponse({
    status: 204,
    description: "Сookie удалён и больше пользователь не сможет делать запросы только до окончания accessToken"
  })
  @ApiResponse({
    status: 401,
    type: UnauthorizedError,
    description: 'Пользователь не авторизован через Cookie'
  })
  @ApiCookieAuth()
  @RefreshAuth()
  @Delete('logout')
  async logout(
    @Req() req: any,
    @Res() res: Response
  ) {
    return this.authService.logOut(req, res)
  }
}