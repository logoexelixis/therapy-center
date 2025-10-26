import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

type Therapist = { id: string; full_name: string };
type SessionRow = {
  therapy: 'LOGOTHERAPY' | 'ERGOTHERAPY' | 'PSYCHOTHERAPY' | 'PARENT_COUNSELLING';
  therapist_id: string;
  weekday: 'MON'|'TUE'|'WED'|'THU'|'FRI'|'SAT';
  time: string; // HH:mm in allowed slots
};

const THERAPY_OPTIONS = [
  { value: 'LOGOTHERAPY',  label: 'Λογοθεραπεία' },
  { value: 'ERGOTHERAPY',   label: 'Εργοθεραπεία' },
  { value: 'PSYCHOTHERAPY',   label: 'Ψυχοθεραπεία' },
  { value: 'PARENT_COUNSELLING', label: 'Συμβουλευτική γονέων' },
] as const;

const WEEKDAYS = [
  { value: 'MON', label: 'Δευτέρα' },
  { value: 'TUE', label: 'Τρίτη' },
  { value: 'WED', label: 'Τετάρτη' },
  { value: 'THU', label: 'Πέμπτη' },
  { value: 'FRI', label: 'Παρασκευή' },
  { value: 'SAT', label: 'Σάββατο' },
] as const;

// 13:30–15:45, διάλειμμα 15:45–16:15, 16:15–21:30, ανά 45'
function daySlots() {
  const out: string[] = [];
  const toStr = (d: Date) => d.toTimeString().slice(0,5);
  const pushRange = (start: string, end: string) => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const d = new Date(); d.setHours(sh, sm, 0, 0);
    const E = new Date(); E.setHours(eh, em, 0, 0);
    while (d <= E) { out.push(toStr(d)); d.setMinutes(d.getMinutes()+45); }
  };
  pushRange('13:30','15:45');
  pushRange('16:15','21:30');
  return out;
}
const SLOTS = daySlots();

function addWeeks(d: Date, w: number) { const x = new Date(d); x.setDate(x.getDate() + w*7); return x; }
function nextWeekday(fromDate: Date, weekday: SessionRow['weekday']) {
  // JS: 0=Sun..6=Sat, δικά μας: MON..SAT
  const map: Record<SessionRow['weekday'], number> = { MON:1, TUE:2, WED:3, THU:4, FRI:5, SAT:6 };
  const want = map[weekday];
  const d = new Date(fromDate);
  const cur = d.getDay(); // 0..6
  let delta = want - cur; if (delta < 0) delta += 7;
  if (delta === 0) return d; // ίδια μέρα
  d.setDate(d.getDate() + delta);
  return d;
}

export default function NewClient() {
  const router = useRouter();
  const [me, setMe] = useState<any>(null);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [fullName, setFullName] = useState('');
  const [billing, setBilling] = useState<'MONTHLY' | 'PER_X'>('MONTHLY');
  const [bundle, setBundle] = useState<number>(4); // default bundle 4/8/12/16
  const [startFrom, setStartFrom] = useState<string>(() => new Date().toISOString().slice(0,10));
  const [weeks, setWeeks] = useState<number>(12); // πόσες εβδομάδες να “γράψουμε” μπροστά
  const [rows, setRows] = useState<SessionRow[]>([
    { therapy: 'LOGOTHERAPY', therapist_id: '', weekday: 'MON', time: '13:30' }
  ]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login'); return; }
      const { data: meRows } = await supabase.from('therapists').select('*').eq('auth_user_id', user.id).maybeSingle();
      setMe(meRows ?? null);
      // φέρνουμε όλους για να μπορεί ο admin να κατανέμει
      const { data: th, error } = await supabase.from('therapists').select('id, full_name');
      if (error) setErr(error.message);
      setTherapists(th ?? []);
    })();
  }, [router]);

  const isAdmin = !!me?.is_admin;

  const setRow = (i: number, patch: Partial<SessionRow>) =>
    setRows(prev => prev.map((r,idx)=> idx===i ? { ...r, ...patch } : r));

  const addRow = () => setRows(prev => ([...prev, { therapy: 'LOGOTHERAPY', therapist_id: '', weekday: 'MON', time: '13:30' }]));
  const delRow = (i: number) => setRows(prev => prev.filter((_,idx)=> idx!==i));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null); setErr(null);
    if (!isAdmin) { setErr('Μόνο διαχειριστής μπορεί να δημιουργήσει πελάτη.'); return; }
    if (!fullName.trim()) { setErr('Συμπλήρωσε ονοματεπώνυμο.'); return; }
    if (rows.some(r => !r.therapist_id || !r.time)) { setErr('Συμπλήρωσε θεραπευτή και ώρα σε κάθε γραμμή.'); return; }

    setBusy(true);
    try {
      // 1) Δημιουργία πελάτη
      const { data: cIns, error: cErr } = await supabase
        .from('clients')
        .insert({
          full_name: fullName.trim(),
          billing_mode: billing,             // enum('MONTHLY'|'PER_X')
          charge_bundle: billing === 'PER_X' ? bundle : null
        })
        .select('id')
        .single();
      if (cErr) throw new Error('Δημιουργία πελάτη: ' + cErr.message);
      const clientId = cIns.id as string;

      // 2) Δημιουργία επαναλαμβανόμενων ραντεβού για N εβδομάδες
      const startBase = new Date(startFrom + 'T00:00:00');
      const inserts: any[] = [];

      for (const r of rows) {
        // βρες την 1η ημερομηνία αυτού του weekday από την startFrom
        const first = nextWeekday(startBase, r.weekday);
        const [hh, mm] = r.time.split(':').map(Number);

        for (let w=0; w<weeks; w++) {
          const d = addWeeks(first, w);
          const start = new Date(d);
          start.setHours(hh, mm, 0, 0);
          const end = new Date(start);
          end.setMinutes(end.getMinutes() + 45);

          inserts.push({
            therapist_id: r.therapist_id,
            client_id: clientId,
            therapy: r.therapy,
            start_dt: start.toISOString(),
            end_dt: end.toISOString(),
            status: 'SCHEDULED',
            is_paid: false,
          });
        }
      }

      if (inserts.length) {
        const { error: aErr } = await supabase.from('appointments').insert(inserts);
        if (aErr) throw new Error('Δημιουργία ραντεβού: ' + aErr.message);
      }

      setMsg('✅ Ο πελάτης δημιουργήθηκε και προστέθηκαν επαναλαμβανόμενα ραντεβού.');
      setTimeout(()=> router.push('/'), 1200);
    } catch (e:any) {
      setErr(e.message ?? String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{maxWidth:880, margin:'40px auto', padding:'0 16px'}}>
      <h2>Νέος πελάτης</h2>
      {!isAdmin && <div style={{background:'#fff7db',border:'1px solid #f1e3a3',padding:10,borderRadius:8,marginBottom:12}}>
        Πρέπει να είσαι <b>διαχειριστής</b> για να συνεχίσεις.
      </div>}
      {err && <div style={{background:'#ffe0e0',border:'1px solid #f5baba',padding:10,borderRadius:8,marginBottom:12}}>{err}</div>}
      {msg && <div style={{background:'#e0ffe7',border:'1px solid #b6f3c6',padding:10,borderRadius:8,marginBottom:12}}>{msg}</div>}

      <form onSubmit={save}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 220px 220px', gap:12, alignItems:'end', marginBottom:16}}>
          <div>
            <label>Ονοματεπώνυμο</label>
            <input value={fullName} onChange={e=>setFullName(e.target.value)}
                   style={{width:'100%',padding:10,border:'1px solid #ddd',borderRadius:8}} />
          </div>

          <div>
            <label>Τρόπος χρέωσης</label>
            <select value={billing} onChange={e=>setBilling(e.target.value as any)}
                    style={{width:'100%',padding:10,border:'1px solid #ddd',borderRadius:8}}>
              <option value="MONTHLY">Ανά μήνα</option>
              <option value="PER_X">Ανά Χ συνεδρίες</option>
            </select>
          </div>

          <div>
            <label>Προεπιλογές Χ συνεδριών</label>
            <select value={bundle} onChange={e=>setBundle(Number(e.target.value))}
                    disabled={billing!=='PER_X'}
                    style={{width:'100%',padding:10,border:'1px solid #ddd',borderRadius:8, opacity: billing==='PER_X'?1:0.5}}>
              {[4,8,12,16].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'220px 1fr 1fr 1fr 1fr auto', gap:8, alignItems:'center'}}>
          <div style={{fontWeight:600}}>Θεραπεία</div>
          <div style={{fontWeight:600}}>Θεραπευτής</div>
          <div style={{fontWeight:600}}>Ημέρα</div>
          <div style={{fontWeight:600}}>Ώρα</div>
          <div style={{fontWeight:600}}>Εβδομάδες</div>
          <div />

          {rows.map((r, i) => (
            <>
              <select key={`therapy-${i}`} value={r.therapy} onChange={e=>setRow(i,{therapy:e.target.value as any})}
                      style={{padding:10,border:'1px solid #ddd',borderRadius:8}}>
                {THERAPY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>

              <select key={`ther-${i}`} value={r.therapist_id} onChange={e=>setRow(i,{therapist_id:e.target.value})}
                      style={{padding:10,border:'1px solid #ddd',borderRadius:8}}>
                <option value="">— επίλεξε —</option>
                {therapists.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
              </select>

              <select key={`day-${i}`} value={r.weekday} onChange={e=>setRow(i,{weekday:e.target.value as any})}
                      style={{padding:10,border:'1px solid #ddd',borderRadius:8}}>
                {WEEKDAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>

              <select key={`time-${i}`} value={r.time} onChange={e=>setRow(i,{time:e.target.value})}
                      style={{padding:10,border:'1px solid #ddd',borderRadius:8}}>
                {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <input key={`weeks-${i}`} type="number" min={1} max={52} value={weeks}
                     onChange={e=>setWeeks(Number(e.target.value))}
                     style={{padding:10,border:'1px solid #ddd',borderRadius:8}} />

              <button key={`del-${i}`} type="button" onClick={()=>delRow(i)}
                      style={{padding:'8px 10px',border:'1px solid #ddd',borderRadius:8,background:'#fff'}}>✕</button>
            </>
          ))}
        </div>

        <div style={{marginTop:12, display:'flex', gap:8, alignItems:'center'}}>
          <button type="button" onClick={addRow}
                  style={{padding:'10px 12px',border:'none',borderRadius:8,background:'#0ea5e9',color:'#fff',fontWeight:600}}>
            + Προσθήκη γραμμής
          </button>

          <div style={{marginLeft:'auto', display:'flex', gap:8, alignItems:'center'}}>
            <label>Έναρξη από</label>
            <input type="date" value={startFrom} onChange={e=>setStartFrom(e.target.value)}
                   style={{padding:10,border:'1px solid #ddd',borderRadius:8}} />
            <button disabled={busy || !isAdmin} type="submit"
                    style={{padding:'12px 16px',border:'none',borderRadius:8,background: busy?'#a3a3a3':'#16a34a',color:'#fff',fontWeight:700}}>
              {busy ? 'Αποθήκευση...' : 'Αποθήκευση'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
