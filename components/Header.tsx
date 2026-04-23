export default function Header() {
  return (
    <header>
      <div className="hdr" style={{ justifyContent: 'center' }}>
        <img 
          src="/logo.png" 
          alt="JOPESA Logo" 
          style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #C8960C', objectFit: 'cover' }}
        />
        <div className="hdr-t">
          <h1>JOPESA Connect</h1>
          <div className="hdr-sub">JOPACC Wum · Est. 2007</div>
          <div className="hdr-mot">Lux Mundi Et Sal Terrae</div>
        </div>
      </div>
    </header>
  );
}
