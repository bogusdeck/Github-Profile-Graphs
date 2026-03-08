import { useState, useEffect } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [pixelGrid, setPixelGrid] = useState<{width: number, height: number}>({width: 0, height: 0});

  useEffect(() => {
    setMounted(true);

    const updateDimensions = () => {
      // Use viewport dimensions to ensure full coverage
      const width = Math.max(window.innerWidth, document.documentElement.clientWidth);
      const height = Math.max(window.innerHeight, document.documentElement.clientHeight);
      setPixelGrid({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-green-950 text-green-400 relative"
      style={{
        backgroundColor: '#89c201',
        color: '#89c201',
        imageRendering: 'pixelated',
        fontFamily: 'monospace'
      }}
    >
      {/* Pixel grid background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 20px)',
          gridTemplateRows: 'repeat(auto-fill, 20px)',
          gap: 0,
          zIndex: 0
        }}
      >
        {mounted && pixelGrid.width > 0 && Array.from({ length: Math.ceil(pixelGrid.height / 20) * Math.ceil(pixelGrid.width / 20) }, (_, index) => {
          const cols = Math.ceil(pixelGrid.width / 20);
          const row = Math.floor(index / cols);
          const col = index % cols;

          // Create pixelated transition pattern
          let backgroundColor = '#28370e'; // default dark green

          // Create pixelated transition effect around the transition line
          const totalRows = Math.ceil(pixelGrid.height / 20);
          const transitionRow = Math.floor(totalRows * 0.40); // Move transition down to 40%

          if (row < transitionRow - 5) {
            // Well above transition - pure light green
            backgroundColor = '#89c201';
          } else if (row > transitionRow + 5) {
            // Well below transition - pure dark green
            backgroundColor = '#28370e';
          } else {
            // Extended transition zone - scattered pixels covering both sections
            const seed1 = (row * 31 + col * 37) % 100;
            const seed2 = (row * 41 + col * 43) % 100;
            const seed3 = (row * 53 + col * 59) % 100;

            // Gradient effect - more dark pixels as we go down
            const distanceFromTransition = row - transitionRow;
            let threshold = 50; // Base 50/50 mix

            if (distanceFromTransition < -2) {
              // Above transition - favor light green
              threshold = 30; // 70% light, 30% dark
            } else if (distanceFromTransition > 2) {
              // Below transition - favor dark green
              threshold = 70; // 30% light, 70% dark
            }

            const randomValue = (seed1 + seed2 + seed3) % 100;
            backgroundColor = randomValue < threshold ? '#28370e' : '#89c201';
          }

          // For now, simple split - we'll add transition logic later

          return (
            <div
              key={index}
              style={{
                width: '20px',
                height: '20px',
                backgroundColor
              }}
            />
          );
        })}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative" style={{ zIndex: 2 }}>
        {/* Header */}
        <header className="text-center mb-10">
          <div
            className="inline-block p-6 sm:p-8 md:p-10 rounded retro-title"
            style={{
              borderColor: '#000000',
              backgroundColor: '#89c201',
            }}
          >
            <h1
              className="text-2xl sm:text-3xl md:text-5xl font-bold text-green-400 mb-2 retro-title"
              style={{
                color: '#28370e',
                letterSpacing: '0.15em',
              }}
            >
              GITHUB GRAPH PLAYGROUND
            </h1>
            <p className="text-green-300 text-sm sm:text-base md:text-lg retro-text" style={{ color: '#28370e' }}>
              Retro 8-bit GitHub Profile Analytics
            </p>
          </div>
        </header>

        {/* Top Section - Daily Coding (Full Width) */}
        <section className="mb-6">
          <div
            className="border-4 border-green-400 bg-green-950 rounded overflow-hidden"
            style={{
              borderColor: '#000000',
              backgroundColor: 'transparent',
              minHeight: '200px'
            }}
          >
            <img
              src="/api/daily-commits"
              alt="Daily Coding"
              className="w-full h-full object-contain"
              style={{ minHeight: '200px' }}
            />
          </div>
        </section>

        {/* Middle Section - Streak & Languages (2 columns) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Coding Streak */}
          <div
            className="border-4 border-green-400 bg-green-950 rounded overflow-hidden"
            style={{
              borderColor: '#000000',
              backgroundColor: '#28370d',
              minHeight: '180px'
            }}
          >
            <img
              src="/api/streak"
              alt="Coding Streak"
              className="w-full h-full object-contain"
              style={{ minHeight: '180px' }}
            />
          </div>

          {/* Languages Used */}
          <div
            className="border-4 border-green-400 bg-gray-900 rounded overflow-hidden relative"
            style={{
              borderColor: '#000000',
              backgroundColor: '#28370d',
              minHeight: '180px'
            }}
          >
            <img
              src="/api/languages"
              alt="Languages Used"
              className="w-full h-full object-contain"
              style={{ minHeight: '180px' }}
            />
          </div>
        </section>

        {/* Bottom Section - Stats Grid (3 columns on desktop) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Repos per Language */}
          <div
            className="border-4 border-green-400 bg-green-950 rounded overflow-hidden relative"
            style={{
              borderColor: '#000000',
              backgroundColor: '#28370d',
              minHeight: '280px'
            }}
          >
            <img
              src="/api/repos-per-language"
              alt="Repos per Language"
              className="w-full h-full object-contain"
              style={{ minHeight: '280px' }}
            />
          </div>

          {/* Stars per Language */}
          <div
            className="border-4 border-green-400 bg-green-950 rounded overflow-hidden relative"
            style={{
              borderColor: '#000000',
              backgroundColor: '#28370d',
              minHeight: '280px'
            }}
          >
            <img
              src="/api/stars-per-language"
              alt="Stars per Language"
              className="w-full h-full object-contain"
              style={{ minHeight: '280px' }}
            />
          </div>

          {/* Commits per Language */}
          <div
            className="border-4 border-green-400 bg-green-950 rounded overflow-hidden relative"
            style={{
              borderColor: '#000000',
              backgroundColor: '#28370d',
              minHeight: '280px'
            }}
          >
            <img
              src="/api/commits-per-language"
              alt="Commits per Language"
              className="w-full h-full object-contain"
              style={{ minHeight: '280px' }}
            />
          </div>

          {/* Commits per Repo */}
          <div
            className="border-4 border-green-400 bg-green-950 rounded overflow-hidden relative"
            style={{
              borderColor: '#000000',
              backgroundColor: '#28370d',
              minHeight: '320px'
            }}
          >
            <img
              src="/api/commits-per-repo"
              alt="Commits per Repo"
              className="w-full h-full object-contain"
              style={{ minHeight: '320px' }}
            />
          </div>

          {/* Stars per Repo */}
          <div
            className="border-4 border-green-400 bg-gray-900 rounded overflow-hidden relative sm:col-span-2 lg:col-span-1"
            style={{
              borderColor: '#000000',
              backgroundColor: '#28370d',
              minHeight: '320px'
            }}
          >
            <img
              src="/api/stars-per-repo"
              alt="Stars per Repo"
              className="w-full h-full object-contain"
              style={{ minHeight: '320px' }}
            />
          </div>

        </section>

        {/* Footer */}
        <footer className="text-center mt-10 pt-6 border-t-2 border-green-800 retro-text" style={{ borderTopColor: '#000000' }}>
          <p className="text-green-400 text-xs" style={{ color: '#89c201' }}>
            Built with Next.js • Styled with Tailwind • Powered by GitHub API
          </p>
          <p className="text-green-600 text-xs mt-2" style={{ color: '#6a9a0a' }}>
            2026 GitHub Graph Playground
          </p>
        </footer>

      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        img {
          max-width: 100%;
          display: block;
        }

        /* Retro pixel game font application */
        h1, h2, h3 {
          font-family: 'Minecrafter', 'Retro Gaming', monospace !important;
          letter-spacing: 0.15em !important;
        }

        body, p, span, div {
          font-family: 'Determination', 'Retro Gaming', monospace !important;
        }
      `}</style>
    </div>
  );
}
