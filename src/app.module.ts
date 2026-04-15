import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from './modules/jwt/jwt.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { TokenService } from './modules/jwt/jwt.service';
import { UsersModule } from './modules/users/users.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [AuthModule, UsersModule, JwtModule, PrismaModule, TasksModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
