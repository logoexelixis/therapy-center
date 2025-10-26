export default function NotFound() {
  return (
    <div style={{minHeight:'100vh',display:'grid',placeItems:'center',fontFamily:'system-ui'}}>
      <div style={{textAlign:'center'}}>
        <h1 style={{margin:0,fontSize:48}}>404</h1>
        <p style={{opacity:0.8}}>Η σελίδα δεν βρέθηκε.</p>
        <a href="/" style={{textDecoration:'underline'}}>Επιστροφή στην αρχική</a>
      </div>
    </div>
  );
}
