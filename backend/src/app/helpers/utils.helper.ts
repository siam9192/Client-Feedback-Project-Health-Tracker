import { Types } from 'mongoose';

export function objectId(id: string): Types.ObjectId {
  return new Types.ObjectId(id);
}
export function getCurrentWeek() {
  const currentDate = new Date();
  const januaryFirst = new Date(currentDate.getFullYear(), 0, 1);
  const daysToNextMonday =
    januaryFirst.getDay() === 1 ? 0 : (7 - januaryFirst.getDay()) % 7;
  const nextMonday = new Date(
    currentDate.getFullYear(),
    0,
    januaryFirst.getDate() + daysToNextMonday,
  );

  const weekNumber =
    currentDate < nextMonday
      ? 52
      : currentDate.getTime() > nextMonday.getTime()
        ? Math.ceil(
            (currentDate.getTime() - nextMonday.getTime()) /
              (24 * 3600 * 1000) /
              7,
          )
        : 1;

  const year = currentDate.getFullYear();

  return {
    weekNumber,
    year,
  };
}
