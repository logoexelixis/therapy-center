import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Me() {
  const [out, setOut] = useState<any>({ loading: true });

  useEffect(() => {
    (async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      const me = await supabase
        .from('therapists')
        .select('*')
        .eq('auth_user_id', user?.id ?? '')
        .limit(1)
        .maybeSingle();

      setOut({
        user,
        authError,
        therapists_query: {
          error: me.error?.message ?? null,
          status: me.status,
          count: me.count ?? null,
          data: me.data ?? null,
        },
      });
    })();
  }, []);

  return (
    <pre style={{ padding: 16, background: '#111', color: '#0f0', borderRadius: 8 }}>
      {JSON.stringify(out, null, 2)}
    </pre>
  );
}

