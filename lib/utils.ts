import { Shift, ValueStream } from '@prisma/client';

export const shiftLabels = { FIRST: '1st', SECOND: '2nd', THIRD: '3rd' } as const;
export const streamLabels = { WCZ: 'WCZ', BCZ: 'BCZ' } as const;

export const allShifts = Object.values(Shift);
export const allStreams = Object.values(ValueStream);

export function eachDate(start: Date, end: Date) {
  const out: Date[] = [];
  const d = new Date(start);
  while (d <= end) {
    out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}
