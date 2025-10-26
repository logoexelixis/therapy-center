import type { AppProps } from 'next/app';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

function Toolbar({ isAdmin, hasSession }: { isAdmin: boolean; hasSession: boolean }) {
  const router = useRouter();
  const go = (p: string) => () => router.push(p);
  const signOut = async () => { await supabase.auth.signOut(); router.push('/login'); };

  if (!hasSession) return null;

  if (isAdmin) {
    // Μπάρα μόνο για διαχειριστές
    return (
      <div style={{
        display:'flex', alignItems:'center', gap:8,
        padding:'10px 16px', background:'#fff', borderBottom:'1px solid #eee',
        position:'sticky', top:0, zIndex:1000
      }}>
        <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
          <button onClick={go('/')} style={{padding:'8px 12px', border:'1px solid #ddd', borderRadius:8, background:'#fff'}}>Αρχική</button>
          <button onClick={go('/clients/new')} style={{padding:'8px 12px', border:'1px solid #ddd', borderRadius:8, background:'#fff'}}>Νέος πελάτης</button>
          <button onClick={go('/admin/clients')} style={{padding:'8px 12px', border:'1px solid #ddd', borderRadius:8, background:'#fff'}}>Πελάτες</button>
          <button onClick={signOut} style={{padding:'8px 12px', border:'1px solid #ddd', borderRadius:8, background:'#fff'}}>Έξοδος</button>
        </div>
      </div>
    );
  }

  // Μόνο μικρό “Έξοδος” για θεραπευτές (όχι μπάρα)
  return (
    <div style={{ position:'fixed', top:10, right:10, zIndex:1000 }}>
      <button
        onClick={signOut}
        style={{ padding:'6px 10px', border:'1px solid #ddd', borderRadius:6, background:'#fff', fontSize:13 }}
      >
        Έξοδος
      </button>
    </div>
  );
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const sub = supabase.auth.onAuthStateChange((_e, session) => {
      setHasSession(!!session);
    });

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setHasSession(!!user);
      if (!user) { setIsAdmin(false); return; }

      // Έλεγχος ΜΟΝΟ από τη βάση: therapists.is_admin
      try {
        const { data, error } = await supabase
          .from('therapists')
          .select('is_admin')
          .eq('auth_user_id', user.id)
          .maybeSingle();

        if (error) {
          console.warn('therapists is_admin check error:', error.message);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data?.is_admin);
        }
      } catch {
        setIsAdmin(false);
      }
    })();

    return () => { sub.data?.subscription.unsubscribe(); };
  }, []);

  return (
    <>
      <Toolbar isAdmin={isAdmin} hasSession={hasSession} />
      <Component {...pageProps} />
    </>
  );
}
