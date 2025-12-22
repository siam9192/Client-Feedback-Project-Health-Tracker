import { NotificationCategory, NotificationType } from '@prisma/client';
import notificationService from '../modules/notification/notification.service';
import { TaskEvent } from '../types';
import { emitToUser } from './io.hepler';

export function getAssignedUserChange(
  previous?: string | null,
  next?: string | null,
) {
  const changed = previous !== next;

  return { changed, from: previous ?? null, to: next ?? null };
}

export function notifyUser(
  userId: string,
  data: { id: string; title: string },
  title: string,
  message: string,
  category: NotificationCategory,
) {
  notificationService.instantNotifyToUsers([userId], {
    title,
    message,
    category,
    type: NotificationType.Info,
    entityId: data.id,
  });
}

export function emitTaskEvent(
  userId: string,
  event: TaskEvent,
  taskId: string,
) {
  emitToUser(userId, event, { id: taskId });
}
