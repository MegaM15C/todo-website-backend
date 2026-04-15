import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { StringValue } from 'ms'

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) { }

  generateAccessToken(userId: string) {
    return this.jwt.sign({ sub: userId }, {
      secret: this.config.get<string>('jwt.accessSecret'),
      expiresIn: this.config.get<StringValue>('jwt.accessTtl', '15m')
    })
  }

  generateRefreshToken(userId: string) {
    return this.jwt.sign({ sub: userId }, {
      secret: this.config.get<string>('jwt.refreshSecret'),
      expiresIn: this.config.get<StringValue>('jwt.refreshTtl', '30d')
    })
  }

  verifyAccessToken(token: string) {
    return this.jwt.verify(token, {
      secret: this.config.get<string>('jwt.accessSecret'),
    })
  }

  verifyRefreshToken(token: string) {
    return this.jwt.verify(token, {
      secret: this.config.get<string>('jwt.refreshSecret'),
    })
  }
}