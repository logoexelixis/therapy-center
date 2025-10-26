import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import * as XLSX from 'xlsx';
import { slugifyGreek } from '../../lib/slug';

// dd/MM/yyyy
function fmtDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

type ClientRow = { id: string; full_name: string };

export default function ExportPage() {
  const [me, setMe] = useState<any>(null);
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }

      const meQ = await supabase
        .from('therapists')
        .select('id, full_name, is_admin')
        .eq('auth_user_id', user.id)
        .maybeSingle();
      setMe(meQ.data);

      if (!meQ.data?.is_admin) {
        setMsg('Απαγορεύεται η πρόσβαση (μόνο για Διαχειριστές).');
        return;
      }

      const cl = await supabase
        .from('clients')
        .select('id, full_name')
        .order('full_name', { ascending: true });
      setClients(cl.data ?? []);
    })();
  }, []);

  const exportOne = async (client: ClientRow) => {
    if (!me?.is_admin) return;
    setBusyId(client.id);
    setMsg(null);
    try {
      const q = await supabase
        .from('appointments')
        .select('start_dt, status, is_paid, therapy, therapists(full_name)')
        .eq('client_id', client.id)
        .in('status', ['PRESENT','NO_SHOW'])
        .order('start_dt', { ascending: true });

      if (q.error) throw q.error;
      const rows = q.data ?? [];

      // Δεδομένα για Excel, στα Ελληνικά
      const data = rows.map((r: any) => {
        // therapy -> Ελληνικά
        let therapyGR = '';
        switch (r.therapy) {
          case 'LOGOTHERAPY': therapyGR = 'Λογοθεραπεία'; break;
          case 'ERGOTHERAPY': therapyGR = 'Εργοθεραπεία'; break;
          case 'PSYCHOTHERAPY': therapyGR = 'Ψυχοθεραπεία'; break;
          case 'PARENT_COUNSELLING': therapyGR = 'Συμβουλευτική Γονέων'; break;
          default: therapyGR = String(r.therapy ?? '');
        }
        // status -> Ελληνικά
        let statusGR = '';
        switch (r.status) {
          case 'PRESENT': statusGR = 'Προσήλθε'; break;
          case 'CANCELLED_ON_TIME': statusGR = 'Ακύρωση έγκαιρη'; break;
          case 'NO_SHOW': statusGR = 'Δεν ενημέρωσε'; break;
          case 'SCHEDULED': statusGR = 'Προγραμματισμένο'; break;
          default: statusGR = String(r.status ?? '');
        }

        return {
          'Πελάτης': client.full_name,
          'Ημερομηνία': fmtDate(r.start_dt),
          'Θεραπευτής': r.therapists?.full_name ?? '',
          'Θεραπεία': therapyGR,
          'Κατάσταση': statusGR,
          'Πληρωμένο': r.is_paid ? 'Ναι' : 'Όχι',
        };
      });

      // Δημιουργία Workbook/Worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data, { header: ['Πελάτης','Ημερομηνία','Θεραπευτής','Θεραπεία','Κατάσταση','Πληρωμένο'] });
      XLSX.utils.book_append_sheet(wb, ws, 'Συνεδρίες');

      // Όνομα αρχείου με ελληνικό -> λατινικό slug + fallback
      let base = slugifyGreek(client.full_name);
      if (!base || base === '_' || base === '-') {
        base = `pelatis_${client.id.slice(0,8)}`;
      }
      const filename = `${base}.xlsx`;

      XLSX.writeFile(wb, filename); // θα κατεβάσει το αρχείο στο browser
      setMsg(`Εξαγωγή ολοκληρώθηκε για "${client.full_name}".`);
    } catch (e: any) {
      setMsg(`Αποτυχία εξαγωγής: ${e?.message ?? String(e)}`);
    } finally {
      setBusyId(null);
    }
  };

  if (msg && !me?.is_admin) {
    return <div style={{ padding: 24 }}>{msg}</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Εξαγωγή δεδομένων (Excel .xlsx)</h2>
      <p style={{opacity:0.8}}>Μόνο για διαχειριστές. Ημερομηνίες <strong>ηη/μμ/εεεε</strong>, επικεφαλίδες στα Ελληνικά.</p>

      {msg && <div style={{margin:'12px 0', padding:12, background:'#f8fafc', border:'1px solid #e5e7eb', borderRadius:8}}>{msg}</div>}

      {!me?.is_admin ? (
        <div>Έλεγχος δικαιωμάτων…</div>
      ) : (
        <div style={{display:'grid', gap:8, maxWidth:700}}>
          {clients.map(c => (
            <div key={c.id} style={{display:'flex', alignItems:'center', gap:8, border:'1px solid #eee', borderRadius:10, padding:12}}>
              <div style={{flex:1}}><strong>{c.full_name}</strong></div>
              <button
                onClick={()=>exportOne(c)}
                disabled={busyId === c.id}
                style={{padding:'8px 12px', border:'none', borderRadius:8, background:'#0ea5e9', color:'#fff', fontWeight:600}}
              >
                {busyId === c.id ? 'Εξαγωγή…' : 'Εξαγωγή Excel'}
              </button>
            </div>
          ))}
          {clients.length === 0 && <div>Δεν υπάρχουν πελάτες ακόμα.</div>}
        </div>
      )}
    </div>
  );
}
