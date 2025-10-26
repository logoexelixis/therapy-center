import * as XLSX from 'xlsx';

export type SessionRow = {
  date: string;          // "dd/MM/yyyy"
  time: string;          // "HH:mm"
  therapist?: string;    // προαιρετικά
  therapy?: string;      // LOGOTHERAPY / ERGOTHERAPY / ...
  status: 'PRESENT' | 'NO_SHOW' | 'CANCELLED_ON_TIME' | 'SCHEDULED';
  receipt_no?: string | null;
  is_paid?: boolean | null;
};

// Φτιάχνει .xlsx μόνο με τις χρεώσιμες καταστάσεις (PRESENT, NO_SHOW)
export function exportClientSessionsXlsx(
  fullName: string,
  rows: SessionRow[],
) {
  const chargeable = rows.filter(r => r.status === 'PRESENT' || r.status === 'NO_SHOW');

  const sheetRows = chargeable.map(r => ({
    'Ημερομηνία': r.date,
    'Ώρα': r.time,
    'Θεραπευτής': r.therapist ?? '',
    'Θεραπεία': r.therapy ?? '',
    'Κατάσταση': r.status === 'PRESENT' ? 'Προσήλθε' : r.status === 'NO_SHOW' ? 'Δεν ενημέρωσε' : r.status,
    'Απόδειξη': r.receipt_no ?? '',
  }));

  const ws = XLSX.utils.json_to_sheet(sheetRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Συνεδρίες');

  const ab = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  const safeName = fullName.replace(/[^A-Za-zΑ-Ωα-ω0-9 _.-]+/g, '').trim() || 'πελάτης';
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeName}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
