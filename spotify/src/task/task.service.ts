import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    this.logger.log('CRON задача выполняется каждые 10 секунд');
  }

  @Interval(1000)
  handleInterval() {
    this.logger.log('Interval задача каждую секунду');
  }

  @Timeout(5000)
  handleTimeout() {
    this.logger.log('Timeout задача через 5 секунд после старта');
  }
}
