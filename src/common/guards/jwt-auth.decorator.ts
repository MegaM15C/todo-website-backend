import { applyDecorators, UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from '../guards/jwt-auth.guard';

export function RefreshAuth() {
  return applyDecorators(
    UseGuards(RefreshTokenGuard)
  );
}