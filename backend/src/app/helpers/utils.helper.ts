import { Types } from 'mongoose';

interface WeekInfo {
  year: number;
  week: number;
}

export function objectId(id: string): Types.ObjectId {
  return new Types.ObjectId(id);
}
export function getCurrentWeek(): WeekInfo {
  return getISOweekYear(new Date());
}

// Get ISO week number of a given Date
export function getISOweekYear(d: Date): WeekInfo {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));

  const day = date.getUTCDay() || 7; // Sunday -> 7
  date.setUTCDate(date.getUTCDate() + 4 - day);

  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );

  return { week, year: date.getFullYear() };
}

// Return recent N week numbers
export function getRecentWeeks(count: number = 5): WeekInfo[] {
  const weeks: WeekInfo[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const dt = new Date(today);
    dt.setDate(today.getDate() - i * 7);

    weeks.push(getISOweekYear(dt));
  }

  return weeks;
}

export function getWeeksBetweenDates(
  startDate: Date,
  endDate: Date,
): WeekInfo[] {
  const weeks: WeekInfo[] = [];

  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  while (current <= endDate) {
    const { week, year } = getISOweekYear(current);

    const exists = weeks.some((w) => w.week === week && w.year === year);
    if (!exists) {
      weeks.push({ week, year });
    }

    current.setDate(current.getDate() + 7);
  }

  return weeks;
}
