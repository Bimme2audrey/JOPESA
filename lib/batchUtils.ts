import { BatchInfo } from '@/types';

const SY = 2007;
const CLASS_NAMES: Record<number, string> = {
  1: 'Form 1',
  2: 'Form 2',
  3: 'Form 3',
  4: 'Form 4',
  5: 'Form 5',
  6: 'Lower Sixth',
  7: 'Upper Sixth',
};
const YRS_LEFT: Record<number, number> = { 1: 7, 2: 6, 3: 5, 4: 4, 5: 3, 6: 2, 7: 1 };

export { SY, CLASS_NAMES, YRS_LEFT };

export function maxClass(year: number): number {
  const diff = year - SY;
  return diff >= 6 ? 7 : diff + 1;
}

export function getBatchInfo(year: number, cls: number): BatchInfo {
  const form1Year = year - (cls - 1);
  const batch = form1Year - SY + 1;
  const acadYear = year + '/' + (year + 1);
  const f1AcadYear = form1Year + '/' + (form1Year + 1);
  const yrsLeft = YRS_LEFT[cls];
  const gradStart = form1Year + 6;
  const gradYear = gradStart + '/' + (gradStart + 1);
  return {
    batch,
    acadYear,
    f1AcadYear,
    gradYear,
    yrsLeft,
    className: CLASS_NAMES[cls],
  };
}

export function updateYearHint(year: string): string {
  const val = parseInt(year);
  if (val >= 2007 && val <= 2100) {
    return `→ Academic year: ${val}/${val + 1}`;
  } else if (year.length >= 4) {
    return val < 2007 ? 'Year must be 2007 or later' : 'Please enter a valid year';
  }
  return '';
}
