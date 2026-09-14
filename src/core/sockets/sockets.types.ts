
export interface SocketData {
  studentCode: string;
}

const STUDENT_ROOM_PREFIX = 'student:';

export function studentRoom(studentCode: string): string {
  return `${STUDENT_ROOM_PREFIX}${studentCode}`;
}