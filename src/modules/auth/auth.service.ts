import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { randomBytes, createHash } from 'crypto';
import { AuthDto } from './dto/auth-requests.dto';
import type { Response, Request } from 'express';
import { TokenService } from '../jwt/jwt.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly tokenService: TokenService,
  ) { }

  async RegistrationUser(
    createDto: AuthDto,
    res: Response
  ) {
    const userDB = await this.usersRepo.findUserByEmail(createDto.email)
    if (userDB) {
      throw new ConflictException({ message: "User is already registered" })
    }

    const pwdHash = await bcrypt.hash(createDto.password, 10)
    const userId = await this.usersRepo.create(createDto.email, pwdHash)

    const accessToken = this.tokenService.generateAccessToken(userId)
    const refreshToken = this.tokenService.generateRefreshToken(userId)
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10)
    await this.usersRepo.createRefreshToken(userId, refreshTokenHash)

    res.cookie(
      'refreshToken',
      refreshToken,
      {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60000 * 60 * 24 * 30 // 30 дней
      }
    )

    return {
      accessToken: accessToken
    }
  }

  async logIn(
    loginDto: AuthDto,
    res: Response
  ) {
    const user = await this.usersRepo.findUserByEmail(loginDto.email)
    if (!user) {
      throw new UnauthorizedException({ message: "Invalid credentials" })
    }
    const isMatch = await bcrypt.compare(loginDto.password, user.password_hash)
    if (!isMatch) {
      throw new UnauthorizedException({ message: "Invalid credentials" })
    }
    const accessToken = this.tokenService.generateAccessToken(user.id)
    const refreshToken = this.tokenService.generateRefreshToken(user.id)
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10)
    await this.usersRepo.createRefreshToken(user.id, refreshTokenHash)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,        
      sameSite: 'none',    
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      accessToken: accessToken
    }
  }

  async refreshAccessToken(
    req: Request,
    res: Response
  ) {
    const refreshToken = req.cookies['refreshToken']

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing')
    }

    const payload = this.tokenService.verifyRefreshToken(refreshToken)

    const user = await this.usersRepo.findUserById(payload.sub)

    if (!user) {
      throw new NotFoundException('User not found')
    }
    if (!user.refresh_token_hash) {
      throw new UnauthorizedException('No refresh token stored')
    }

    const isValid = await bcrypt.compare(
      refreshToken,
      user.refresh_token_hash
    )

    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const accessToken = this.tokenService.generateAccessToken(user.id)
    const newRefreshToken = this.tokenService.generateRefreshToken(user.id)

    const newHash = await bcrypt.hash(newRefreshToken, 10)
    await this.usersRepo.createRefreshToken(user.id, newHash)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return { accessToken: accessToken }
  }
  async logOut(
    req: any,
    res: Response
  ) {
    res.clearCookie('refreshToken');
    await this.usersRepo.deleteRefreshToken(req.user.id);
    return res.status(204).send()
  }
}