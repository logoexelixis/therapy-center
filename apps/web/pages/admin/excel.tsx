import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import { slugifyGreek } from '../../lib/slug';

type Client = { id: string; full_name: string };

export default function AdminExcel() {
  const router = useRouter();
  const qClientId = typeof router.query.clientId === 'string' ? router.query.clientId : '';
  const [me, setMe] = useState<any>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState<string>('');
  const [objects, setObjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // auth + check admin + load clients
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }

      const { data: meRows } = await supabase
        .from('therapists')
        .select('*')
        .eq('auth_user_id', user.id)
        .maybeSingle();
      setMe(meRows);

      if (!meRows?.is_admin) { setMsg('Δεν έχεις δικαιώματα διαχειριστή.'); return; }

      const { data: cls } = await supabase
        .from('clients')
        .select('id, full_name')
        .order('full_name');
      const list = cls ?? [];
      setClients(list);

      // προ-επιλογή από URL ?clientId=...
      if (qClientId && list.find(c => c.id === qClientId)) {
        setClientId(qClientId);
      } else if (list.length > 0) {
        setClientId(list[0].id);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qClientId]);

  // list files
  useEffect(() => {
    (async () => {
      if (!clientId) { setObjects([]); return; }
      const { data, error } = await supabase.storage
        .from('clients')
        .list(clientId, { limit: 100, sortBy: { column: 'name', order: 'asc' } });
      if (error) { setMsg('List error: ' + error.message); setObjects([]); return; }
      setObjects(data ?? []);
    })();
  }, [clientId]);

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    if (!me?.is_admin) { setMsg('Μόνο διαχειριστής.'); return; }
    if (!clientId) { setMsg('Διάλεξε πελάτη.'); return; }
    if (!file) { setMsg('Διάλεξε αρχείο .xlsx.'); return; }

    const client = clients.find(c => c.id === clientId);
    const base = slugifyGreek(client?.full_name ?? 'arxeio');
    const ext = file.name.toLowerCase().endsWith('.xlsx') ? '.xlsx' : (file.name.match(/\.[^.]+$/)?.[0] ?? '');
    const path = `${clientId}/${base}${ext || '.xlsx'}`;

    setLoading(true);
    const { error } = await supabase.storage.from('clients').upload(path, file, {
      upsert: true,
      cacheControl: '3600',
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    setLoading(false);

    if (error) { setMsg('Upload error: ' + error.message); return; }
    setMsg('Αποθηκεύτηκε: ' + path);

    const { data } = await supabase.storage
      .from('clients')
      .list(clientId, { limit: 100, sortBy: { column: 'name', order: 'asc' } });
    setObjects(data ?? []);
  };

  const onDownload = async (name: string) => {
    const path = `${clientId}/${name}`;
    const { data, error } = await supabase.storage.from('clients').download(path);
    if (error) { setMsg('Download error: ' + error.message); return; }
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 760, margin: '40px auto', padding: 16 }}>
      <h2>Excel πελάτη (Storage)</h2>
      {!me?.is_admin && <div style={{ color: '#b00' }}>{msg || 'Μόνο για διαχειριστές'}</div>}

      <form onSubmit={onUpload} style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        <label>Πελάτης</label>
        <select value={clientId} onChange={e => setClientId(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #ddd' }}>
          {clients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
        </select>

        <label>Αρχείο (.xlsx)</label>
        <input type="file" accept=".xlsx" onChange={e => setFile(e.target.files?.[0] ?? null)} />

        <button disabled={loading || !me?.is_admin} style={{ padding: 10, borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600 }}>
          {loading ? 'Ανέβασμα...' : 'Ανέβασμα / Αντικατάσταση'}
        </button>
      </form>

      {msg && <div style={{ marginTop: 12, color: '#065f46' }}>{msg}</div>}

      <h3 style={{ marginTop: 24 }}>Αρχεία πελάτη</h3>
      {objects.length === 0 ? (
        <div>Δεν υπάρχουν αρχεία.</div>
      ) : (
        <ul>
          {objects.map(o => (
            <li key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{o.name}</span>
              <button onClick={() => onDownload(o.name)} style={{ marginLeft: 8, padding: '4px 8px', borderRadius: 6, border: '1px solid #ddd' }}>
                Download
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
