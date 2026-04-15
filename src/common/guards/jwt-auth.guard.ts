import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { TokenService } from 'src/modules/jwt/jwt.service';
import { UsersRepository } from 'src/modules/users/users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly usersRepo: UsersRepository,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()

    const token = req.cookies['refreshToken']

    if (!token) {
      throw new UnauthorizedException({message: 'Refresh token missing'})
    }

    try {
      const payload = this.tokenService.verifyRefreshToken(token)

      const user = await this.usersRepo.findUserById(payload.sub)

      if (!user) {
        throw new UnauthorizedException({message: 'User not found'})
      }

      if (!user.refresh_token_hash) {
        throw new UnauthorizedException({message: 'No refresh token stored'})
      }

      const isValid = await bcrypt.compare(
        token,
        user.refresh_token_hash
      )

      if (!isValid) {
        throw new UnauthorizedException({message: 'Invalid refresh token'})
      }

      req.user = user
      req.refreshToken = token

      return true
    } catch {
      throw new UnauthorizedException({message: 'Invalid refresh token'})
    }
  }
}