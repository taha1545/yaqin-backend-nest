import { Global, Module } from '@nestjs/common';
import { PrismaModule } from './database';
import { JwtCoreModule } from './jwt';
import { LoggerModule } from './logger';
import { MailModule } from './mail';
import { SocketModule } from './sockets';
import { StorageModule } from './storage';

@Global()
@Module({
  imports: [LoggerModule, PrismaModule, MailModule, StorageModule, JwtCoreModule, SocketModule],
  exports: [LoggerModule, PrismaModule, MailModule, StorageModule, JwtCoreModule, SocketModule],
})
export class CoreModule {}
