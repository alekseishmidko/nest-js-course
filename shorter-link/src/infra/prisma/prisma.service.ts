import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  /**
   * PrismaService использует @prisma/adapter-pg
   * для подключения к PostgreSQL через pg.Pool

   */
  public constructor(private readonly configService: ConfigService) {
    /**
     * Создаём PrismaPg adapter с явной конфигурацией подключения.
     * PrismaPg принимает либо:
     *  - pg.Pool
     *  - либо объект конфигурации pg.Pool
     */
    const adapter = new PrismaPg({
      user: configService.getOrThrow('POSTGRES_USER'),
      password: configService.getOrThrow('POSTGRES_PASSWORD'),
      host: configService.getOrThrow('POSTGRES_HOST'),
      port: configService.getOrThrow('POSTGRES_PORT'),
      database: configService.getOrThrow('POSTGRES_DATABASE'),
    });
    /**
     * Передаём adapter в PrismaClient.
     * После этого Prisma будет использовать PostgreSQL
     * через pg вместо стандартного драйвера.
     */
    super({ adapter });
  }
  public async onModuleInit(): Promise<void> {
    const start = Date.now();
    this.logger.log('Connecting prisma');
    try {
      await this.$connect();
      const ms = Date.now() - start;

      this.logger.log(`DB connection established ${ms}ms`);
    } catch (e) {
      this.logger.error(`error connection to db: ${e}`);
      throw e;
    }
  }

  public async onModuleDestroy(): Promise<void> {
    this.logger.log('Disconnected DB');

    try {
      await this.$disconnect();

      this.logger.log(`DB connection closed`);
    } catch (e) {
      this.logger.error(`error disconnection to db: ${e}`);
      throw e;
    }
  }
}
