import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';

import { SocketPresenceService } from './socket.presence';
import type { SocketData } from './sockets.types';
import { studentRoom } from './sockets.types';

@WebSocketGateway()
export class SocketGateway {
  //
  @WebSocketServer()
  private readonly server!: Server;
  private readonly logger = new Logger(SocketGateway.name);

  constructor(private readonly presence: SocketPresenceService) { }

  async handleConnection(client: Socket): Promise<void> {
    try {
      const studentCode = this.getStudentCode(client);
      if (!studentCode) {
        client.disconnect(true);
        return;
      }
      //
      const data = client.data as SocketData;
      data.studentCode = studentCode;
      //
      await client.join(studentRoom(studentCode));
      this.presence.connect(studentCode);
      this.logger.log(`Connected: ${client.id} (${studentCode})`);
    } catch {
      this.logger.warn(`Rejected: ${client.id}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket): void {
    const data = client.data as Partial<SocketData>;
    //
    if (!data.studentCode) return;
    //
    this.presence.disconnect(data.studentCode);
    this.logger.log(`Disconnected: ${client.id} (${data.studentCode})`);
  }

  emitToStudent(studentCode: string, event: string, payload: unknown,): void {
    this.server
      .to(studentRoom(studentCode))
      .emit(event, payload);
  }

  emitToRoom(room: string, event: string, payload: unknown,): void {
    this.server.to(room).emit(event, payload);
  }

  broadcast(event: string, payload: unknown): void {
    this.server.emit(event, payload);
  }


  private getStudentCode(client: Socket): string | undefined {
    const code = client.handshake.auth?.studentCode;
    //
    if (typeof code === 'string' && code.trim()) return code.trim();
    //  
    return undefined;
  }
}