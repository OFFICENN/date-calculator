export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
  totalWeeks: number;
  nextBirthday: Date;
  daysUntilBirthday: number;
  zodiacSign: string;
  chineseZodiac: string;
}

export interface DateDiffResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
}

export interface MilestoneItem {
  label: string;
  days: number;
  date: Date;
  isPast: boolean;
}

const ZODIAC_SIGNS: { sign: string; start: [number, number] }[] = [
  { sign: "♑ やぎ座", start: [12, 22] },
  { sign: "♒ みずがめ座", start: [1, 20] },
  { sign: "♓ うお座", start: [2, 19] },
  { sign: "♈ おひつじ座", start: [3, 21] },
  { sign: "♉ おうし座", start: [4, 20] },
  { sign: "♊ ふたご座", start: [5, 21] },
  { sign: "♋ かに座", start: [6, 22] },
  { sign: "♌ しし座", start: [7, 23] },
  { sign: "♍ おとめ座", start: [8, 23] },
  { sign: "♎ てんびん座", start: [9, 23] },
  { sign: "♏ さそり座", start: [10, 23] },
  { sign: "♐ いて座", start: [11, 22] },
];

const CHINESE_ZODIAC = [
  "🐀 子（ねずみ）",
  "🐄 丑（うし）",
  "🐅 寅（とら）",
  "🐇 卯（うさぎ）",
  "🐉 辰（たつ）",
  "🐍 巳（へび）",
  "🐴 午（うま）",
  "🐑 未（ひつじ）",
  "🐒 申（さる）",
  "🐔 酉（とり）",
  "🐕 戌（いぬ）",
  "🐗 亥（いのしし）",
];

export function getZodiacSign(month: number, day: number): string {
  for (let i = ZODIAC_SIGNS.length - 1; i >= 0; i--) {
    const [m, d] = ZODIAC_SIGNS[i].start;
    if (month > m || (month === m && day >= d)) {
      return ZODIAC_SIGNS[i].sign;
    }
  }
  return ZODIAC_SIGNS[0].sign;
}

export function getChineseZodiac(year: number): string {
  return CHINESE_ZODIAC[(year - 4) % 12];
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 86400000;
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utcB - utcA) / msPerDay);
}

export function calculateAge(birthday: Date, baseDate?: Date): AgeResult {
  const today = baseDate ?? new Date();

  let years = today.getFullYear() - birthday.getFullYear();
  let months = today.getMonth() - birthday.getMonth();
  let days = today.getDate() - birthday.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = daysBetween(birthday, today);
  const totalMonths = years * 12 + months;
  const totalWeeks = Math.floor(totalDays / 7);

  let nextBirthdayYear = today.getFullYear();
  let nextBirthday = new Date(
    nextBirthdayYear,
    birthday.getMonth(),
    birthday.getDate()
  );
  if (nextBirthday <= today) {
    nextBirthdayYear++;
    nextBirthday = new Date(
      nextBirthdayYear,
      birthday.getMonth(),
      birthday.getDate()
    );
  }
  const daysUntilBirthday = daysBetween(today, nextBirthday);

  const zodiacSign = getZodiacSign(
    birthday.getMonth() + 1,
    birthday.getDate()
  );
  const chineseZodiac = getChineseZodiac(birthday.getFullYear());

  return {
    years,
    months,
    days,
    totalDays,
    totalMonths,
    totalWeeks,
    nextBirthday,
    daysUntilBirthday,
    zodiacSign,
    chineseZodiac,
  };
}

export function calculateDateDiff(startDate: Date, endDate: Date): DateDiffResult {
  const isReverse = startDate > endDate;
  const [a, b] = isReverse ? [endDate, startDate] : [startDate, endDate];

  let years = b.getFullYear() - a.getFullYear();
  let months = b.getMonth() - a.getMonth();
  let days = b.getDate() - a.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(b.getFullYear(), b.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.abs(daysBetween(startDate, endDate));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;

  return { years, months, days, totalDays, totalWeeks, totalHours };
}

export function addDaysToDate(base: Date, daysToAdd: number): Date {
  const result = new Date(base);
  result.setDate(result.getDate() + daysToAdd);
  return result;
}

export function getMilestones(birthday: Date): MilestoneItem[] {
  const today = new Date();
  const milestones = [
    { label: "100日", days: 100 },
    { label: "365日（1年）", days: 365 },
    { label: "500日", days: 500 },
    { label: "1,000日", days: 1000 },
    { label: "2,000日", days: 2000 },
    { label: "3,000日", days: 3000 },
    { label: "5,000日", days: 5000 },
    { label: "7,777日", days: 7777 },
    { label: "10,000日", days: 10000 },
    { label: "15,000日", days: 15000 },
    { label: "20,000日", days: 20000 },
    { label: "25,000日", days: 25000 },
    { label: "30,000日", days: 30000 },
  ];

  return milestones.map(({ label, days }) => {
    const date = addDaysToDate(birthday, days);
    const isPast = date <= today;
    return { label, days, date, isPast };
  });
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}/${m}/${d}`;
}

export function formatDateInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const DAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"];

export function getDayOfWeek(date: Date): string {
  return DAY_NAMES[date.getDay()];
}

export function formatDateWithDay(date: Date): string {
  return `${formatDate(date)}（${getDayOfWeek(date)}）`;
}
