import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

type Therapist = { id: string; full_name: string; is_admin?: boolean };
type Appointment = {
  id: string;
  therapist_id: string;
  client_id: string;
  start_dt: string;
  status: 'SCHEDULED' | 'PRESENT' | 'CANCELLED_ON_TIME' | 'NO_SHOW';
  clients?: { full_name: string } | null;
  therapists?: { full_name: string } | null;
};

// 13:30–15:45, διάλειμμα 15:45–16:15, 16:15–21:30 (ανά 45')
function makeDaySlots() {
  const times: string[] = [];
  const toStr = (d: Date) => d.toTimeString().slice(0, 5);
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
  pushRange('13:30', '15:45');
  pushRange('16:15', '21:30');
  return times;
}

export default function Home() {
  const router = useRouter();
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [me, setMe] = useState<Therapist | null>(null);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const slots = useMemo(() => makeDaySlots(), []);

  // Σειρά θεραπευτών (για admin view)
  const ORDERED_NAMES = [
    'Τσάλη Χριστίνα',
    'Χοτζάρ Οζτζάν',
    'Μπατζάκ Χαρούν',
    'Παπαδοπούλου Ηλιάνα',
    'Γεωργιάδου Χριστίνα',
    'Κοτζά Ναζλή',
    'Μουμίν Φατμέ',
    'Ποιμενίδου Μαρία',
  ];

  function orderTherapists(ts: Therapist[]) {
    const indexOf = (name: string) => ORDERED_NAMES.indexOf(name);
    return [...ts].sort((a, b) => {
      const ia = indexOf(a.full_name);
      const ib = indexOf(b.full_name);
      if (ia === -1 && ib === -1) return a.full_name.localeCompare(b.full_name);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
  }

  useEffect(() => {
    const sub = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.replace('/login');
    });

    (async () => {
      setLoading(true);
      // Ποιος είμαι
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login'); return; }

      const { data: meRows } = await supabase
        .from('therapists')
        .select('*')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      const meT = meRows ?? null;
      setMe(meT);

      // Αν είμαι admin → πάρε όλους τους θεραπευτές, αλλιώς μόνο εμένα
      if (meT?.is_admin) {
        const { data: thAll } = await supabase
          .from('therapists')
          .select('id, full_name, is_admin')
          .order('full_name');
        setTherapists(orderTherapists(thAll ?? []));
      } else if (meT) {
        setTherapists([{ id: meT.id, full_name: meT.full_name, is_admin: !!meT.is_admin }]);
      } else {
        setTherapists([]);
      }
      setLoading(false);
    })();

    return () => { sub.data?.subscription.unsubscribe(); };
  }, [router]);

  async function loadAppointments(forDate: string, meT: Therapist | null) {
    if (!meT) return;
    const start = new Date(`${forDate}T00:00:00`); // local start
    const end   = new Date(`${forDate}T23:59:59`); // local end

    let q = supabase
      .from('appointments')
      .select('id, therapist_id, client_id, start_dt, status, clients(full_name,is_active), therapists(full_name)')
      .gte('start_dt', start.toISOString())
      .lte('start_dt', end.toISOString())
  .eq('clients.is_active', true)
      .eq('clients.is_active', true);

    // Θεραπευτής -> βλέπει μόνο τα δικά του
    if (!meT.is_admin) {
      q = q.eq('therapist_id', meT.id);
    }

    const { data } = await q;
    setAppts(data ?? []);
  }

  useEffect(() => {
    loadAppointments(date, me);
  }, [date, me?.id, me?.is_admin]);

  // group ανά θεραπευτή + ώρα
  const mapByTherapist: Record<string, Record<string, Appointment>> = useMemo(() => {
    const m: Record<string, Record<string, Appointment>> = {};
    for (const a of appts) {
      const t = a.therapist_id;
      const time = new Date(a.start_dt).toTimeString().slice(0, 5);
      m[t] ||= {};
      m[t][time] = a;
    }
    return m;
  }, [appts]);

  // αλλαγή status με click
  const cycleStatus = (s: Appointment['status']) => {
    if (s === 'SCHEDULED') return 'PRESENT';
    if (s === 'PRESENT') return 'CANCELLED_ON_TIME';
    if (s === 'CANCELLED_ON_TIME') return 'NO_SHOW';
    return 'SCHEDULED';
  };

  async function onToggle(a: Appointment | undefined) {
    if (!a) return;
    // Θεραπευτής μπορεί να αλλάζει μόνο τα δικά του
    if (!me?.is_admin && a.therapist_id !== me?.id) return;

    const next = cycleStatus(a.status);
    await supabase
      .from('appointments')
      .update({ status: next })
      .eq('id', a.id);

    // refresh
    loadAppointments(date, me);
  }

  const visibleTherapists = therapists; // ήδη φιλτραρισμένοι για non-admin

  if (loading) return <div style={{padding:20}}>Φόρτωση…</div>;

  return (
    <div style={{padding:20}}>
      <header style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
        <h2 style={{margin:0}}>Ημερήσιο πρόγραμμα</h2>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        <div style={{marginLeft:'auto'}}>
          {me?.is_admin ? <strong>Διαχειριστής</strong> : <span>Θεραπευτής</span>} — {me?.full_name}
        </div>
      </header>

      <div style={{display:'grid', gridTemplateColumns:`120px repeat(${visibleTherapists.length}, 1fr)`, gap:8}}>
        <div />
        {visibleTherapists.map(t => (
          <div key={t.id} style={{fontWeight:600}}>{t.full_name}</div>
        ))}

        {slots.map((time) => (
          <React.Fragment key={time}>
            <div style={{padding:'8px 4px',fontWeight:600,opacity:0.8}}>{time}</div>
            {visibleTherapists.map((t) => {
              const a = mapByTherapist[t.id]?.[time];
              const bg = !a
                ? '#fafafa'
                : a.status === 'PRESENT'
                  ? '#e0ffe7'
                  : a.status === 'CANCELLED_ON_TIME'
                    ? '#fff7db'
                    : a.status === 'NO_SHOW'
                      ? '#ffe0e0'
                      : '#e8f1ff';

              const label = a?.clients?.full_name ?? '';

              return (
                <div
                  key={`${t.id}-${time}`}
                  onClick={() => onToggle(a)}
                  title={a ? `Status: ${a.status}` : 'Κενό'}
                  style={{
                    padding:8,
                    background:bg,
                    border:'1px solid #eee',
                    borderRadius:8,
                    minHeight:42,
                    cursor: a ? 'pointer' : 'default'
                  }}
                >
                  <div style={{fontSize:14, fontWeight:600, marginBottom:2}}>
                    {label}
                  </div>
                  <div style={{fontSize:12, opacity:0.7}}>
                    {a?.therapists?.full_name ?? ''}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div style={{marginTop:16, opacity:0.8, fontSize:14}}>
        <strong>Υπόμνημα:</strong> Κλικ επάνω στο ραντεβού για αλλαγή κατάστασης —
        <span style={{background:'#e0ffe7', padding:'2px 6px', border:'1px solid #ddd', borderRadius:6, marginLeft:6}}>PRESENT</span>
        <span style={{background:'#fff7db', padding:'2px 6px', border:'1px solid #ddd', borderRadius:6, marginLeft:6}}>CANCELLED_ON_TIME</span>
        <span style={{background:'#ffe0e0', padding:'2px 6px', border:'1px solid #ddd', borderRadius:6, marginLeft:6}}>NO_SHOW</span>
        <span style={{background:'#e8f1ff', padding:'2px 6px', border:'1px solid #ddd', borderRadius:6, marginLeft:6}}>SCHEDULED</span>
      </div>
    </div>
  );
}
