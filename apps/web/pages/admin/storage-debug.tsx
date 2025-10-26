import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function StorageDebug() {
  const [out, setOut] = useState<any>({ status: 'running' });

  useEffect(() => {
    (async () => {
      try {
        // 1) Session check
        const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
        const user = sessionData?.session?.user ?? null;
        if (!user) {
          setOut({ status: 'error', step: 'session', error: sessionErr?.message ?? 'No session (login first)' });
          return;
        }

        // 2) List current objects (might fail if SELECT policy λείπει)
        const { data: listBefore, error: listErr, status: listStatus } =
          await supabase.storage.from('clients').list(user.id, { limit: 10 });
        
        // 3) Try a tiny upload to clients/<user.id>/ping.txt
        const blob = new Blob(['ping ' + new Date().toISOString()], { type: 'text/plain' });
        const path = `${user.id}/ping.txt`;
        const { data: upData, error: upErr, status: upStatus } =
          await supabase.storage.from('clients').upload(path, blob, { upsert: true });

        // 4) List again
        const { data: listAfter, error: listAfterErr, status: listAfterStatus } =
          await supabase.storage.from('clients').list(user.id, { limit: 10 });

        setOut({
          status: 'done',
          session: { userId: user.id, email: user.email },
          listBefore: { status: listStatus, error: listErr?.message ?? null, data: listBefore ?? null },
          upload: { status: upStatus, error: upErr?.message ?? null, data: upData ?? null, pathTried: path },
          listAfter: { status: listAfterStatus, error: listAfterErr?.message ?? null, data: listAfter ?? null },
        });
      } catch (e: any) {
        setOut({ status: 'exception', error: e?.message ?? String(e) });
      }
    })();
  }, []);

  return (
    <pre style={{ padding: 16, background: '#111', color: '#0f0', borderRadius: 8 }}>
      {JSON.stringify(out, null, 2)}
    </pre>
  );
}
