// apps/web/lib/slots.ts
export const WEEKDAYS = [
  { key: 'MON', label: 'Δευτέρα' },
  { key: 'TUE', label: 'Τρίτη' },
  { key: 'WED', label: 'Τετάρτη' },
  { key: 'THU', label: 'Πέμπτη' },
  { key: 'FRI', label: 'Παρασκευή' },
  { key: 'SAT', label: 'Σάββατο' },
  { key: 'SUN', label: 'Κυριακή' },
];

export function makeDaySlots(): string[] {
  const times: string[] = [];
  const toStr = (d: Date) => d.toTimeString().slice(0,5);
  const pushRange = (start: string, end: string) => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const d = new Date();
    d.setHours(sh, sm, 0, 0);
    const endD = new Date();
    endD.setHours(eh, em, 0, 0);
    while (d <= endD) {
      times.push(toStr(d));
      d.setMinutes(d.getMinutes() + 45);
    }
  };
  // 13:30–15:45, διάλειμμα 15:45–16:15, 16:15–21:30
  pushRange('13:30', '15:45');
  pushRange('16:15', '21:30');
  return times;
}

export function nextNDatesForWeekday(fromISO: string, weekdayKey: string, n: number): string[] {
  const map: Record<string, number> = { SUN:0, MON:1, TUE:2, WED:3, THU:4, FRI:5, SAT:6 };
  const target = map[weekdayKey];
  const out: string[] = [];
  const d = new Date(fromISO);

  // βρες την πρώτη επόμενη μέρα-στόχο
  let i = 0;
  for (; i < 14; i++) {
    const t = new Date(d.getFullYear(), d.getMonth(), d.getDate()+i);
    if (t.getDay() === target) { out.push(t.toISOString().slice(0,10)); break; }
  }
  if (!out.length) return out;

  const first = new Date(out[0]);
  for (let k=1; k<n; k++) {
    const t = new Date(first);
    t.setDate(first.getDate() + 7*k);
    out.push(t.toISOString().slice(0,10));
  }
  return out;
}
