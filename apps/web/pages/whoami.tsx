import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function WhoAmI() {
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      setInfo({ user, error: error?.message ?? null });
    })();
  }, []);

  return (
    <pre style={{ padding: 16, background: '#111', color: '#0f0', borderRadius: 8 }}>
      {JSON.stringify(info, null, 2)}
    </pre>
  );
}

