import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <>
      <Component {...pageProps} />
      {router.pathname === '/clients/new' && (
        <button
          onClick={() => router.push('/')}
          style={{
            position: 'fixed',
            top: 16,
            left: 16,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #ddd',
            background: 'white',
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            zIndex: 1000,
          }}
        >
          ⟵ Αρχική
        </button>
      )}
    </>
  );
}
