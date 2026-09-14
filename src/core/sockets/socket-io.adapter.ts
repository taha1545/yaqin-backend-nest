import type { INestApplicationContext } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import type { Server, ServerOptions } from 'socket.io';

import type { AppConfig } from '@/config';

export class SocketIoAdapter extends IoAdapter {

  constructor(app: INestApplicationContext, private readonly config: ConfigService<AppConfig, true>,) {
    super(app);
  }

  override createIOServer(port: number, options?: ServerOptions): Server {
    //
    const origins = this.config.get('cors.origins', { infer: true });
    //
    return super.createIOServer(port, {
      ...options,
      cors: {
        origin: origins,
        credentials: true,
      },
    });
  }
}
