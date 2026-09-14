import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketPresenceService {
  //
  private readonly connections = new Map<string, number>();

  connect(studentCode: string): void {
    const count = this.connections.get(studentCode) ?? 0;
    this.connections.set(studentCode, count + 1);
  }

  disconnect(studentCode: string): void {
    const count = this.connections.get(studentCode);
    //
    if (!count || count <= 1) {
      this.connections.delete(studentCode);
      return;
    }
    this.connections.set(studentCode, count - 1);
  }

  isOnline(studentCode: string): boolean {
    return this.connections.has(studentCode);
  }

  getActiveStudentCount(): number {
    return this.connections.size;
  }

  getActiveStudentCodes(): string[] {
    return [...this.connections.keys()];
  }
}