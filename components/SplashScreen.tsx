export default function SplashScreen() {
  return (
    <div id="splash">
      <img 
        src="/logo.png" 
        alt="JOPESA Logo" 
        style={{ width: 100, height: 100, borderRadius: '50%', border: '3px solid #C8960C', objectFit: 'cover', margin: '0 0 16px' }}
      />
      <h1>JOPESA</h1>
      <p>Ex-Students Association · JOPACC Wum</p>
      <div className="dots"><span></span><span></span><span></span></div>
    </div>
  );
}
