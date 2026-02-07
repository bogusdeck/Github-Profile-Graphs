import Head from 'next/head';

export default function FontTest() {
  return (
    <>
      <Head>
        <title>Font Loading Test</title>
        <link href="https://fonts.googleapis.com/css2?family=VT323&family=Press+Start+2P&display=swap" rel="stylesheet" />
        <style>{`
          @font-face {
            font-family: 'Local Retro Gaming';
            src: url('/fonts/RetroGaming.ttf') format('truetype');
            font-display: swap;
          }
          @font-face {
            font-family: 'Local Determination';
            src: url('/fonts/determination.ttf') format('truetype');
            font-display: swap;
          }
          @font-face {
            font-family: 'Local Minecrafter';
            src: url('/fonts/Minecrafter-MA3Dw.ttf') format('truetype');
            font-display: swap;
          }
          
          .google-pixel { font-family: 'Press Start 2P', monospace; }
          .google-retro { font-family: 'VT323', monospace; }
          .local-retro { font-family: 'Local Retro Gaming', monospace; }
          .local-deter { font-family: 'Local Determination', monospace; }
          .local-mc { font-family: 'Local Minecrafter', monospace; }
          
          .test-box {
            border: 2px solid #00ff41;
            padding: 20px;
            margin: 10px 0;
            background: #1a1a2e;
            color: #00ff41;
          }
        `}</style>
      </Head>
      <div className="min-h-screen bg-black p-8 text-green-400">
        <h1 className="text-2xl mb-8 text-center" style={{fontFamily: 'monospace'}}>FONT LOADING TEST</h1>
        
        <div className="test-box google-pixel">
          <strong>Google Font - Press Start 2P:</strong><br/>
          GITHUB GRAPH PLAYGROUND 123
        </div>
        
        <div className="test-box google-retro" style={{fontSize: '1.5em'}}>
          <strong>Google Font - VT323:</strong><br/>
          Retro 8-bit GitHub Profile Analytics 123
        </div>
        
        <div className="test-box local-retro">
          <strong>Local Font - Retro Gaming:</strong><br/>
          If you see pixelated text here, local fonts work!
        </div>
        
        <div className="test-box local-deter" style={{fontSize: '1.3em'}}>
          <strong>Local Font - Determination:</strong><br/>
          Undertale style pixel font test
        </div>
        
        <div className="test-box local-mc">
          <strong>Local Font - Minecrafter:</strong><br/>
          Minecraft style 3D text
        </div>
        
        <div className="mt-8 p-4 border-2 border-yellow-400 text-yellow-400" style={{fontFamily: 'monospace'}}>
          <strong>Debug Info:</strong><br/>
          Check browser console (F12) for font loading errors.<br/>
          If local font boxes look different from this text, fonts are working!<br/>
          If all boxes look the same, fonts failed to load.
        </div>
      </div>
    </>
  );
}
