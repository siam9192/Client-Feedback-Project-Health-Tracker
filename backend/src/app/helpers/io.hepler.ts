import { getIO, getUsersSocketIds } from '../socket/socketStore';

export function emitToUsers(userIds: string[], event: string, data: any) {
  const io = getIO();

  if (!userIds || userIds.length === 0) return;

  const socketIds = getUsersSocketIds(userIds);
  if (socketIds.length) {
    io.to(socketIds).emit(event, data);
  }
}
export function emitToUser(userId: string, event: string, data: any) {
  const io = getIO();

  if (!userId) return;

  const socketIds = getUsersSocketIds([userId]);

  if (socketIds.length) {
    io.to(socketIds).emit(event, data);
  }
}
