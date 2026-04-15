import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '../jwt/jwt.module';
import { UsersRepository } from '../users/users.repository';
import { RefreshTokenGuard } from 'src/common/guards/jwt-auth.guard';
@Module({
  imports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenGuard, UsersRepository],
  exports: [AuthService, RefreshTokenGuard]
})
export class AuthModule { }
