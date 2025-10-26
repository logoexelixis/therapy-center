import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Health() {
  const [result, setResult] = useState<any>({ status: 'starting' });

  useEffect(() => {
    (async () => {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!url || !hasKey) {
          setResult({ status: 'error', error: 'Missing env vars', url, hasKey });
          return;
        }

        const { data: { user }, error } = await supabase.auth.getUser();

        setResult({
          status: 'ok',
          url,
          anonKeyPresent: true,
          user: user ?? null,
          authError: error?.message ?? null,
        });
      } catch (e: any) {
        setResult({ status: 'error', error: e?.message ?? String(e) });
      }
    })();
  }, []);

  return (
    <pre style={{ padding: 16, background: '#111', color: '#0f0', borderRadius: 8 }}>
      {JSON.stringify(result, null, 2)}
    </pre>
  );
}
