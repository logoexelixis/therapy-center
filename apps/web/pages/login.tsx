import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('admin1@local');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setErr(error.message); return; }
    router.push('/');
  };

  return (
    <div style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'#f7f7fb'}}>
      <form onSubmit={signIn} style={{background:'white',padding:24,borderRadius:12,boxShadow:'0 10px 30px rgba(0,0,0,0.08)',width:360}}>
        <h2 style={{marginBottom:16}}>Είσοδος</h2>
        <label style={{display:'block',marginBottom:8, fontSize:12}}>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:10,marginBottom:12,border:'1px solid #ddd',borderRadius:8}} />
        <label style={{display:'block',marginBottom:8, fontSize:12}}>Κωδικός</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:10,marginBottom:12,border:'1px solid #ddd',borderRadius:8}} />
        {err && <div style={{color:'#b00',marginBottom:12}}>{err}</div>}
        <button type="submit" style={{width:'100%',padding:12,borderRadius:8,border:'none',background:'#4f46e5',color:'white',fontWeight:600}}>Σύνδεση</button>
      </form>
    </div>
  );
}
