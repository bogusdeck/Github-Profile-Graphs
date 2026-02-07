import { lineChartSVG, streakSVG } from "../lib/svg";
import { useState, useEffect } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // Static demo data for initial load
  const commits = [3, 5, 2, 8, 4, 6, 7];
  const streak = 42;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="min-h-screen bg-black text-green-400"
      style={{
        imageRendering: 'pixelated',
        fontFamily: 'monospace'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="text-center mb-10">
          <div
            className="inline-block border-4 border-green-400 bg-black p-4 sm:p-6 rounded retro-title"
            style={{ boxShadow: '4px 4px 0px #00ff41' }}
          >
            <h1
              className="text-xl sm:text-2xl md:text-4xl font-bold text-green-400 mb-2 retro-title"
              style={{
                letterSpacing: '0.15em',
                textShadow: '3px 3px 0px #008000, 6px 6px 0px #004d00'
              }}
            >
              📊 GITHUB GRAPH PLAYGROUND
            </h1>
            <p className="text-green-400 text-xs sm:text-sm md:text-base retro-text">
              Retro 8-bit GitHub Profile Analytics
            </p>
          </div>
        </header>

        {/* Top Section - Daily Coding (Full Width) */}
        <section className="mb-6">
          <div
            className="border-4 border-green-400 bg-gray-900 rounded overflow-hidden"
            style={{ minHeight: '200px' }}
          >
            {mounted && (
              <div
                className="w-full h-full"
                style={{ minHeight: '200px' }}
                dangerouslySetInnerHTML={{ __html: lineChartSVG(commits, "Daily Coding") }}
              />
            )}
          </div>
        </section>

        {/* Middle Section - Streak & Languages (2 columns) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Coding Streak */}
          <div
            className="border-4 border-green-400 bg-gray-900 rounded overflow-hidden"
            style={{ minHeight: '180px' }}
          >
            {mounted && (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ minHeight: '180px' }}
                dangerouslySetInnerHTML={{ __html: streakSVG(streak) }}
              />
            )}
          </div>

          {/* Languages Used */}
          <div
            className="border-4 border-green-400 bg-gray-900 rounded overflow-hidden relative"
            style={{ minHeight: '180px' }}
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
            className="border-4 border-green-400 bg-gray-900 rounded overflow-hidden relative"
            style={{ minHeight: '280px' }}
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
            className="border-4 border-green-400 bg-gray-900 rounded overflow-hidden relative"
            style={{ minHeight: '280px' }}
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
            className="border-4 border-green-400 bg-gray-900 rounded overflow-hidden relative"
            style={{ minHeight: '280px' }}
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
            className="border-4 border-green-400 bg-gray-900 rounded overflow-hidden relative"
            style={{ minHeight: '320px' }}
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
            style={{ minHeight: '320px' }}
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
        <footer className="text-center mt-10 pt-6 border-t-2 border-green-800 retro-text">
          <p className="text-green-400 text-xs">
            Built with Next.js • Styled with Tailwind • Powered by GitHub API
          </p>
          <p className="text-green-600 text-xs mt-2">
            © 2026 GitHub Graph Playground
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
