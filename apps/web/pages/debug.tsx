import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Debug() {
  const [out, setOut] = useState<any>({ status: 'loading' });

  useEffect(() => {
    (async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        // 1) Ποιος είμαι
        const me = user ? await supabase
          .from('therapists')
          .select('*')
          .eq('auth_user_id', user.id)
          .maybeSingle() : { data: null, error: { message: 'no user' }, status: null, count: null };

        // 2) Όλοι οι θεραπευτές που "επιτρέπεται" να δω
        const th = await supabase
          .from('therapists')
          .select('id, full_name, is_admin, auth_user_id')
          .order('full_name');

        // 3) Ραντεβού (μόνο σημερινά, όπως στο index)
        const date = new Date().toISOString().slice(0,10);
        const ap = await supabase
          .from('appointments')
          .select('id, therapist_id, client_id, start_dt, status, clients(full_name), therapists(full_name)')
          .gte('start_dt', `${date}T00:00:00.000Z`)
          .lte('start_dt', `${date}T23:59:59.999Z`)
          .order('start_dt');

        setOut({
          status: 'ok',
          sessionUser: user ?? null,
          authError: authError?.message ?? null,
          me: { status: me.status, error: me.error?.message ?? null, data: me.data ?? null },
          therapists: { status: th.status, error: th.error?.message ?? null, count: th.count ?? null, data: th.data ?? [] },
          appointments: { status: ap.status, error: ap.error?.message ?? null, count: ap.count ?? null, data: ap.data ?? [] },
        });
      } catch (e: any) {
        setOut({ status: 'exception', error: e?.message ?? String(e) });
      }
    })();
  }, []);

  return (
    <div style={{padding:20}}>
      <a href="/" style={{display:'inline-block',marginBottom:12}}>&larr; Αρχική</a>
      <pre style={{ padding: 16, background: '#111', color: '#0f0', borderRadius: 8, whiteSpace:'pre-wrap' }}>
        {JSON.stringify(out, null, 2)}
      </pre>
    </div>
  );
}
