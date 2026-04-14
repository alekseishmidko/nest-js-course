import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guards/auth.guard';

export function Authorization() {
  // Удобная обёртка, чтобы в контроллерах не писать UseGuards(JwtGuard) вручную.
  return applyDecorators(UseGuards(JwtGuard));
}
