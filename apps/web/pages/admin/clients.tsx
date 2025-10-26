import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import * as XLSX from 'xlsx';
import { supabase } from '../../lib/supabaseClient';

// statuses: SCHEDULED, PRESENT(χρεώσιμο), NO_SHOW(χρεώσιμο), CANCELLED_ON_TIME(μη χρεώσιμο)
const CHARGEABLE = new Set(['PRESENT', 'NO_SHOW']);

type Client = { id: string; full_name: string; is_active: boolean };
type Therapist = { id: string; full_name: string };
type SessionRow = {
  id: string;
  therapist_id: string;
  start_dt: string;
  status: 'SCHEDULED'|'PRESENT'|'NO_SHOW'|'CANCELLED_ON_TIME';
  therapists?: { full_name: string } | null;
};

function fmtGR(d: string | Date) {
  const dt = typeof d === 'string' ? new Date(d) : d;
  return dt.toLocaleDateString('el-GR'); // π.χ. 26/10/2025
}

export default function AdminClients() {
  const router = useRouter();
  const [me, setMe] = useState<any>(null);

  const [clients, setClients] = useState<Client[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const selectedClient = useMemo(
    () => clients.find(c => c.id === selectedId) || null,
    [clients, selectedId]
  );

  // φόρμα επεξεργασίας
  const [editName, setEditName] = useState('');
  const [editActive, setEditActive] = useState(true);

  // συνεδρίες πελάτη (μόνο «χρωματισμένες», δηλ. exclude SCHEDULED)
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // 1) Έλεγχος admin + φόρτωση λίστας (ενεργοί πρώτα)
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login'); return; }

      const meRes = await supabase.from('therapists')
        .select('*')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (!meRes.data?.is_admin) {
        router.push('/'); // μόνο admin εδώ
        return;
      }
      setMe(meRes.data);

      const [cl, th] = await Promise.all([
        supabase.from('clients')
          .select('id, full_name, is_active')
          .order('is_active', { ascending: false })
          .order('full_name'), // ενεργοί πάνω, μετά ανενεργοί, αλφαβητικά
        supabase.from('therapists')
          .select('id, full_name')
          .order('full_name'),
      ]);
      setClients(cl.data ?? []);
      setTherapists(th.data ?? []);
    })();
  }, [router]);

  // 2) Sync φόρμα όταν αλλάζω πελάτη
  useEffect(() => {
    if (selectedClient) {
      setEditName(selectedClient.full_name);
      setEditActive(!!selectedClient.is_active);
      setMsg(null);
      // φόρτωσε και τις συνεδρίες του (μόνο όσες είναι χρωματισμένες: status != SCHEDULED)
      loadSessions(selectedClient.id);
    } else {
      setEditName('');
      setEditActive(true);
      setSessions([]);
    }
  }, [selectedClient]);

  async function loadSessions(clientId: string) {
    setLoadingSessions(true);
    setMsg(null);
    const { data, error } = await supabase
      .from('appointments')
      .select('id, therapist_id, start_dt, status, therapists(full_name)')
      .eq('client_id', clientId)
      .neq('status', 'SCHEDULED')
      .order('start_dt', { ascending: false });
    setLoadingSessions(false);
    if (error) { setMsg('Αποτυχία φόρτωσης συνεδριών: ' + error.message); setSessions([]); return; }
    setSessions(data ?? []);
  }

  // 3) Αποθήκευση (όνομα + ενεργός). Αν γίνει ενεργός→ανενεργός, trigger θα αφαιρέσει μελλοντικά ραντεβού.
  const saveClient = async () => {
    if (!selectedClient) return;
    setBusy(true); setMsg(null);
    const next = { full_name: editName.trim(), is_active: editActive };
    const { error } = await supabase.from('clients').update(next).eq('id', selectedClient.id);
    setBusy(false);
    if (error) { setMsg('Αποτυχία αποθήκευσης: ' + error.message); return; }
    // ανανέωση λίστας με active πρώτους
    setClients(prev =>
      prev
        .map(c => c.id === selectedClient.id ? { ...c, ...next } : c)
        .sort((a, b) => (a.is_active === b.is_active ? a.full_name.localeCompare(b.full_name) : (a.is_active ? -1 : 1)))
    );
    setMsg('✅ Αποθηκεύτηκε. ' + (!editActive ? 'Ο πελάτης έγινε ανενεργός και βγήκε από τα μελλοντικά ραντεβού.' : ''));
  };

  // 4) Λήψη Excel (μόνο χρεώσιμα)
  const downloadExcel = () => {
    if (!selectedClient) return;
    const clientName = selectedClient.full_name;

    const filtered = sessions.filter(s => CHARGEABLE.has(s.status));
    const rows = filtered.map(s => ([
      fmtGR(s.start_dt),
      clientName,
      s.therapists?.full_name ?? '',
      s.status === 'PRESENT' ? 'Προσήλθε' : 'Δεν ενημέρωσε',
    ]));

    // κεφαλίδες
    rows.unshift(['Ημερομηνία', 'Ονοματεπώνυμο πελάτη', 'Ονοματεπώνυμο θεραπευτή', 'Κατάσταση']);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Χρεώσεις');
    // όνομα αρχείου = ο πελάτης μόνο
    const safeName = clientName.replace(/[\\/:*?"<>|]+/g, '_');
    XLSX.writeFile(wb, `${safeName}.xlsx`);
  };

  const goHome = () => router.push('/');

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <h2 style={{ margin:0 }}>Πελάτες</h2>
        <button onClick={goHome} style={{padding:'8px 12px', border:'1px solid #ddd', borderRadius:8, background:'#fff'}}>← Αρχική</button>
      </div>

      <div style={{ display:'grid', gap:16, gridTemplateColumns: '380px 1fr' }}>
        {/* Αριστερά: Επιλογή & Επεξεργασία */}
        <div style={{ padding:16, border:'1px solid #eee', borderRadius:12 }}>
          <label style={{ fontSize:12, opacity:0.9 }}>Επιλογή πελάτη</label>
          <select
            value={selectedId}
            onChange={e=>setSelectedId(e.target.value)}
            style={{ padding:10, border:'1px solid #ddd', borderRadius:8, width:'100%', marginTop:6 }}
          >
            <option value="">— διάλεξε πελάτη —</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.full_name} {c.is_active ? '' : '(ανενεργός)'}
              </option>
            ))}
          </select>

          {!selectedClient ? (
            <div style={{ opacity:0.7, marginTop:12 }}>Διάλεξε πελάτη για επεξεργασία.</div>
          ) : (
            <div style={{ marginTop:16, display:'grid', gap:12 }}>
              <div>
                <label style={{ display:'block', fontSize:12, marginBottom:6 }}>Ονοματεπώνυμο</label>
                <input
                  value={editName}
                  onChange={e=>setEditName(e.target.value)}
                  style={{ width:'100%', padding:10, border:'1px solid #ddd', borderRadius:8 }}
                />
              </div>

              <label style={{ display:'flex', alignItems:'center', gap:8 }}>
                <input
                  type="checkbox"
                  checked={editActive}
                  onChange={e=>setEditActive(e.target.checked)}
                />
                <span>Ενεργός</span>
              </label>

              <button
                onClick={saveClient}
                disabled={busy || !editName.trim()}
                style={{ padding:'10px 14px', border:'none', borderRadius:8, background:'#16a34a', color:'#fff', fontWeight:600 }}
              >
                Αποθήκευση
              </button>

              {msg && <div style={{ padding:10, background:'#f8fafc', border:'1px solid #e5e7eb', borderRadius:8 }}>{msg}</div>}
            </div>
          )}
        </div>

        {/* Δεξιά: Ιστορικό συνεδριών (ό,τι έχει χρωματίσει ο θεραπευτής) + Λήψη Excel (μόνο χρεώσιμα) */}
        <div style={{ padding:16, border:'1px solid #eee', borderRadius:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <h3 style={{ margin:0 }}>Συνεδρίες</h3>
            <div style={{ display:'flex', gap:8 }}>
              <button
                onClick={()=> selectedClient && loadSessions(selectedClient.id)}
                disabled={!selectedClient || loadingSessions}
                style={{ padding:'8px 12px', border:'1px solid #ddd', borderRadius:8, background:'#fff' }}
              >
                Ανανέωση
              </button>
              <button
                onClick={downloadExcel}
                disabled={!selectedClient || sessions.length === 0}
                style={{ padding:'8px 12px', border:'none', borderRadius:8, background:'#0ea5e9', color:'#fff', fontWeight:600 }}
                title="Λήψη Excel μόνο με χρεώσιμες (Προσήλθε/Δεν ενημέρωσε)"
              >
                Λήψη Excel
              </button>
            </div>
          </div>

          {!selectedClient ? (
            <div style={{ opacity:0.7 }}>Διάλεξε πελάτη για να δεις συνεδρίες.</div>
          ) : loadingSessions ? (
            <div>Φόρτωση…</div>
          ) : sessions.length === 0 ? (
            <div>Δεν υπάρχουν συνεδρίες.</div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'140px 1fr 180px', gap:'8px 12px' }}>
              <div style={{ fontWeight:600, opacity:0.8 }}>Ημερομηνία</div>
              <div style={{ fontWeight:600, opacity:0.8 }}>Θεραπευτής</div>
              <div style={{ fontWeight:600, opacity:0.8 }}>Κατάσταση</div>
              {sessions.map(s => (
                <React.Fragment key={s.id}>
                  <div>{fmtGR(s.start_dt)}</div>
                  <div>{s.therapists?.full_name ?? ''}</div>
                  <div>
                    {s.status === 'PRESENT' ? 'Προσήλθε'
                      : s.status === 'NO_SHOW' ? 'Δεν ενημέρωσε'
                      : s.status === 'CANCELLED_ON_TIME' ? 'Έγκαιρη ακύρωση'
                      : '—'}
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- helper: οριστική διαγραφή πελάτη (admin only) ---
async function deleteClientPermanently(
  supabase: any,
  client: { id: string; full_name: string },
  setClients: (updater: any) => void,
  setSelectedClient: (c: any) => void,
  setMsg: (s: string) => void
) {
  if (!client?.id) return;
  const ok = window.confirm(
    `Οριστική διαγραφή πελάτη «${client.full_name}»;\n\nΑυτό θα διαγράψει και όλα τα ραντεβού/συνεδρίες/αρχεία του.`
  );
  if (!ok) return;

  // 1) Storage cleanup: clients/<clientId>/*
  const bucket = 'clients';

  const { data: list, error: listErr } = await supabase.storage
    .from(bucket)
    .list(client.id, { limit: 1000 });

  if (!listErr && list?.length) {
    const paths = list.map((o: any) => `${client.id}/${o.name}`);
    const { error: rmErr } = await supabase.storage.from(bucket).remove(paths);
    if (rmErr) console.warn('Storage remove error:', rmErr.message);
  } else if (listErr) {
    console.warn('Storage list error:', listErr.message);
  }

  // 2) Delete client (RLS πρέπει να επιτρέπει admin delete)
  const { error: delErr } = await supabase.from('clients').delete().eq('id', client.id);
  if (delErr) {
    alert(`Αποτυχία διαγραφής: ${delErr.message}`);
    return;
  }

  // 3) Update UI
  setClients((prev: any[]) => prev.filter((c) => c.id !== client.id));
  setSelectedClient(null);
  setMsg(`✅ Διαγράφηκε οριστικά ο/η «${client.full_name}».`);
}
