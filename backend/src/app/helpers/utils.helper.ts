import { Types } from 'mongoose';

interface WeekInfo {
  year: number;
  week: number;
}

export function objectId(id: string): Types.ObjectId {
  return new Types.ObjectId(id);
}
export function getCurrentWeek(): WeekInfo {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  return {
    week: getISOweek(currentDate),
    year,
  };
}

// Get ISO week number of a given Date
export function getISOweek(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));

  const day = date.getUTCDay() || 7; // Sunday -> 7
  date.setUTCDate(date.getUTCDate() + 4 - day);

  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );

  return weekNo;
}

// Return recent N week numbers
export function getRecentWeeks(count: number = 5): WeekInfo[] {
  const weeks: WeekInfo[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const dt = new Date(today);
    dt.setDate(today.getDate() - i * 7);

    weeks.push({
      year: dt.getFullYear(),
      week: getISOweek(dt),
    });
  }

  return weeks;
}
