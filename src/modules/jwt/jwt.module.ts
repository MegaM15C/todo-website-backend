import { Module } from '@nestjs/common'
import { JwtModule as NestJwtModule } from '@nestjs/jwt'
import { TokenService } from './jwt.service'
import { ConfigModule } from '@nestjs/config'
import { JwtStrategy } from './jwt-auth.strategy'
import { configuration } from 'src/config/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    NestJwtModule.register({})],
  providers: [TokenService, JwtStrategy],
  exports: [TokenService],
})
export class JwtModule { }