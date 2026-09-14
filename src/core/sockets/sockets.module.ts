import { Module } from '@nestjs/common';

import { SocketGateway } from './sockets.gateway';
import { SocketPresenceService } from './socket.presence';

@Module({
  providers: [
    SocketGateway,
    SocketPresenceService,
  ],
  exports: [
    SocketGateway,
    SocketPresenceService,
  ],
})
export class SocketModule { }