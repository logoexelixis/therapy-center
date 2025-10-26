export function toCSV(rows: any[]): string {
  if (!rows || rows.length === 0) return '';
  const cols = Object.keys(rows[0]);
  const header = cols.join(',');
  const lines = rows.map(r =>
    cols.map(c => {
      const v = r[c];
      const s = v == null ? '' : String(v);
      return s.includes(',') || s.includes('"') || s.includes('\n')
        ? '"' + s.replace(/"/g, '""') + '"'
        : s;
    }).join(',')
  );
  return [header, ...lines].join('\n');
}
