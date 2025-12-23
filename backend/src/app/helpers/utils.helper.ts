import { TaskEvent } from '../types';
import { emitToUser } from './io.hepler';
import { Types } from 'mongoose';

export function emitTaskEvent(
  userId: string,
  event: TaskEvent,
  taskId: string,
) {
  emitToUser(userId, event, { id: taskId });
}

export function objectId(id: string): Types.ObjectId {
  return new Types.ObjectId(id);
}
