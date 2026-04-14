import { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';

export async function getJwtConfig(
  configService: ConfigService,
): Promise<JwtModuleOptions> {
  return {
    // Тот же секрет используется JwtService при sign/verify
    // и passport-jwt внутри JwtStrategy.
    secret: configService.getOrThrow<string>('JWT_SECRET'),
    signOptions: {
      algorithm: 'HS256',
    },
    verifyOptions: {
      // Фиксируем алгоритм верификации, чтобы не принимать токены с другим alg.
      algorithms: ['HS256'],
      ignoreExpiration: false,
    },
  };
}
