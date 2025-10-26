import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

// helper για slots
function makeDaySlots() {
  const times: string[] = [];
  const toStr = (d: Date) => d.toTimeString().slice(0,5);
  const pushRange = (start: string, end: string) => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const d = new Date(); d.setHours(sh, sm, 0, 0);
    const endD = new Date(); endD.setHours(eh, em, 0, 0);
    while (d <= endD) { times.push(toStr(d)); d.setMinutes(d.getMinutes() + 45); }
  };
  pushRange('13:30', '15:45');
  pushRange('16:15', '21:30');
  return times;
}

export default function Home() {
  const router = useRouter();
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0,10));
  const [me, setMe] = useState<any>(null);
  const [therapists, setTherapists] = useState<any[]>([]);
  const [appts, setAppts] = useState<any[]>([]);
  const slots = useMemo(()=>makeDaySlots(),[]);
  
  useEffect(() => {
    const sub = supabase.auth.onAuthStateChange((_event, session)=> {
      if (!session) router.replace('/login');
    });
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login'); return; }

      const { data: meRows } = await supabase.from('therapists').select('*').eq('auth_user_id', user.id).limit(1);
      setMe(meRows?.[0] ?? null);

      const { data: th } = await supabase.from('therapists').select('id, full_name').order('full_name');
      setTherapists(th ?? []);
    })();
    return () => { sub.data?.subscription.unsubscribe(); };
  }, [router]);

  useEffect(() => {
    if (!me) return;
    (async () => {
      const { data } = await supabase
        .from('appointments')
        .select('id, therapist_id, client_id, start_dt, status, is_paid, clients(full_name)')
        .gte('start_dt', `${date}T00:00:00.000Z`)
        .lte('start_dt', `${date}T23:59:59.999Z`);
      setAppts(data ?? []);
    })();
  }, [me, date]);

  const mapByTherapist: Record<string, Record<string, any>> = useMemo(()=>{
    const m: Record<string, Record<string, any>> = {};
    for (const a of appts) {
      const t = a.therapist_id;
      const time = new Date(a.start_dt).toTimeString().slice(0,5);
      m[t] ||= {};
      m[t][time] = a;
    }
    return m;
  }, [appts]);

  return (
    <div style={{padding:20}}>
      <header style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
        <h2 style={{margin:0}}>Ημερήσιο πρόγραμμα</h2>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        <div style={{marginLeft:'auto'}}>
          {me?.is_admin ? <strong>Διαχειριστής</strong> : <span>Θεραπευτής</span>} – {me?.full_name}
          {me?.is_admin && (
            <button
              onClick={()=>router.push('/clients/new')}
              style={{marginLeft:8, padding:'8px 12px', borderRadius:8, border:'none', background:'#16a34a', color:'#fff', fontWeight:600}}
            >
              + Νέος πελάτης
            </button>
          )}
        </div>
      </header>

      <div style={{display:'grid', gridTemplateColumns:`120px repeat(${therapists.length}, 1fr)`, gap:8}}>
        <div />
        {therapists.map(t => <div key={t.id} style={{fontWeight:600}}>{t.full_name}</div>)}
       {slots.map(time => (
  <div key={`row-${time}`} style={{contents: 'contents'} as any}>
    <div style={{padding:'8px 4px',fontWeight:600,opacity:0.8}}>{time}</div>
    {visibleTherapists.map((t: any) => {
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
          onClick={() => a && onToggleStatus(a)}
          title={a ? `Κατάσταση: ${a.status}\n(κλικ για εναλλαγή)` : 'Κενό'}
          style={{
            padding: 8,
            background: bg,
            border: '1px solid #eee',
            borderRadius: 8,
            minHeight: 42,
            cursor: a ? 'pointer' : 'default',
            userSelect: 'none',
          }}
        >
          {label}
        </div>
      );
    })}
  </div>
))}
</div>

<div style={{marginTop:16, opacity:0.8, fontSize:14}}>
  <strong>Υπόμνημα:</strong> Κλικ επάνω στο ραντεβού για αλλαγή κατάστασης —
  <span style={{background:'#e0ffe7', padding:'2px 6px', border:'1px solid #ddd', borderRadius:6}}>PRESENT</span> —
  <span style={{background:'#fff7db', padding:'2px 6px', border:'1px solid #ddd', borderRadius:6}}>CANCELLED_ON_TIME</span> —
  <span style={{background:'#ffe0e0', padding:'2px 6px', border:'1px solid #ddd', borderRadius:6}}>NO_SHOW</span> —
  <span style={{background:'#e8f1ff', padding:'2px 6px', border:'1px solid #ddd', borderRadius:6}}>SCHEDULED</span>
</div>

                <div key={`${t.id}-${time}`} style={{padding:8, background:bg, border:'1px solid #eee', borderRadius:8, minHeight:42}}>
                  {!label ? null : me?.is_admin ? (
                    <a href={`/admin/excel?clientId=${a.client_id}`} style={{ textDecoration: 'underline' }}>
                      {label}
                    </a>
                  ) : (
                    <span>{label}</span>
                  )}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}
