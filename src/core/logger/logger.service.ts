import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createLogger, format, transports, type Logger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import type { AppConfig } from '@/config';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: Logger;

  constructor(config: ConfigService<AppConfig, true>) {
    const app = config.get('app', { infer: true });
    const logging = config.get('logging', { infer: true });
    const isProduction = app.env === 'production';
    //
    const fileTransport = new DailyRotateFile({
      dirname: logging.dir,
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      zippedArchive: true,
    });
    //
    this.logger = createLogger({
      level: logging.level,
      defaultMeta: {
        service: app.name,
      },
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        isProduction ? format.json() : format.combine(format.colorize(), format.simple()),
      ),
      transports: isProduction ? [fileTransport] : [new transports.Console(), fileTransport],
    });
  }

  log(message: string, context?: string): void {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, {
      context,
      ...(trace && { trace }),
    });
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, { context });
  }
}
