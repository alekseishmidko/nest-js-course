import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from 'src/config/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    // PassportModule подключает интеграцию Nest с passport,
    // чтобы guards могли вызывать зарегистрированные стратегии по имени.
    PassportModule,
    // JwtModule нужен AuthService для подписи и верификации access/refresh токенов.
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  // JwtStrategy регистрирует passport-стратегию с именем "jwt".
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
