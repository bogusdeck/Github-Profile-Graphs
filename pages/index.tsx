import { lineChartSVG, streakSVG } from "../lib/svg";

export default function Home() {
  // Static demo data for initial load
  const commits = [3, 5, 2, 8, 4, 6, 7];
  const streak = 42;

  return (
    <div className="min-h-screen bg-black" style={{imageRendering: 'pixelated'}}>
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="inline-block border-4 border-green-400 bg-black p-4">
            <h1 className="text-2xl md:text-4xl font-bold text-green-400 mb-2" style={{fontFamily: 'monospace', letterSpacing: '0.1em', textShadow: '2px 2px 0px #00ff41'}}>
              📊 GITHUB GRAPH PLAYGROUND
            </h1>
            <p className="text-green-400 text-sm md:text-base" style={{fontFamily: 'monospace'}}>
              Retro 8-bit GitHub Profile Analytics
            </p>
          </div>
        </header>

        {/* Top three graphs - two row layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily coding graph - full width on top */}
          <div className="lg:col-span-2">
            <div className="border-4 border-green-400 bg-black p-2" style={{width: '100%', height: '180px'}}>
              <div dangerouslySetInnerHTML={{ __html: lineChartSVG(commits, "Daily Coding") }} />
            </div>
          </div>
          
          {/* Streak graph */}
          <div className="border-4 border-green-400 bg-black p-2" style={{width: '100%', height: '160px'}}>
            <div dangerouslySetInnerHTML={{ __html: streakSVG(streak) }} />
          </div>
          
          {/* Languages graph */}
          <div className="border-4 border-green-400 bg-black p-2" style={{width: '100%', height: '160px'}}>
            <img 
              src="/api/languages" 
              alt="Languages Used" 
              style={{width: '100%', height: '100%', objectFit: 'contain'}}
            />
          </div>
        </div>

        {/* Bottom graphs grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border-4 border-green-400 bg-black p-2">
            <img 
              src="/api/repos-per-language" 
              alt="Repos per Language" 
              style={{width: '100%', height: '320px', objectFit: 'contain'}}
            />
          </div>
          
          <div className="border-4 border-green-400 bg-black p-2">
            <img 
              src="/api/stars-per-language" 
              alt="Stars per Language" 
              style={{width: '100%', height: '320px', objectFit: 'contain'}}
            />
          </div>
          
          <div className="border-4 border-green-400 bg-black p-2">
            <img 
              src="/api/commits-per-language" 
              alt="Commits per Language" 
              style={{width: '100%', height: '320px', objectFit: 'contain'}}
            />
          </div>
          
          <div className="border-4 border-green-400 bg-black p-2">
            <img 
              src="/api/commits-per-repo" 
              alt="Commits per Repo" 
              style={{width: '100%', height: '400px', objectFit: 'contain'}}
            />
          </div>
          
          <div className="border-4 border-green-400 bg-black p-2">
            <img 
              src="/api/stars-per-repo" 
              alt="Stars per Repo" 
              style={{width: '100%', height: '280px', objectFit: 'contain'}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
