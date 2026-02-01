import { GetServerSideProps } from "next";
import { getDailyCommits, getStreak } from "../lib/github";
import { lineChartSVG, streakSVG } from "../lib/svg";

interface HomeProps {
  commits: number[];
  streak: number;
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const commits = await getDailyCommits(7);
  const streak = await getStreak();

  return {
    props: {
      commits,
      streak,
    },
  };
};

export default function Home({ commits, streak }: HomeProps) {
  return (
    <div className="min-h-screen bg-black" style={{imageRendering: 'pixelated'}}>
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="inline-block border-4 border-green-400 bg-black p-4">
            <h1 className="text-2xl md:text-4xl font-bold text-green-400 mb-2" style={{fontFamily: 'monospace', letterSpacing: '0.1em', textShadow: '2px 2px 0px #00ff41'}}>
              📊 GITHUB GRAPH PLAYGROUND
            </h1>
            <div className="border-t-2 border-green-400 mt-2 pt-2">
              <p className="text-green-400 text-sm md:text-base" style={{fontFamily: 'monospace', letterSpacing: '0.05em'}}>
                [BEAUTIFUL SVG GRAPHS FOR YOUR GITHUB ACTIVITY]
              </p>
            </div>
          </div>
        </header>

        <main className="space-y-8">
          <section className="flex justify-center">
            <div className="border-4 border-green-400 bg-black p-2" style={{width: '100%'}}>
              <div dangerouslySetInnerHTML={{
                __html: lineChartSVG(commits),
              }} />
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="border-4 border-green-400 bg-black p-2">
              <div dangerouslySetInnerHTML={{
                __html: streakSVG(streak),
              }} />
            </div>
            <div className="border-4 border-green-400 bg-black p-2">
              <img 
                src="/api/languages" 
                alt="Languages Used" 
                className="w-full h-auto"
                style={{imageRendering: 'pixelated'}}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="border-4 border-green-400 bg-black p-2">
              <img 
                src="/api/repos-per-language" 
                alt="Repos per Language" 
                className="w-full h-auto"
                style={{imageRendering: 'pixelated'}}
              />
            </div>
            <div className="border-4 border-green-400 bg-black p-2">
              <img 
                src="/api/stars-per-language" 
                alt="Stars per Language" 
                className="w-full h-auto"
                style={{imageRendering: 'pixelated'}}
              />
            </div>
            <div className="border-4 border-green-400 bg-black p-2">
              <img 
                src="/api/commits-per-language" 
                alt="Commits per Language" 
                className="w-full h-auto"
                style={{imageRendering: 'pixelated'}}
              />
            </div>
            <div className="border-4 border-green-400 bg-black p-2">
              <img 
                src="/api/commits-per-repo" 
                alt="Commits per Repo" 
                className="w-full h-auto"
                style={{imageRendering: 'pixelated'}}
              />
            </div>
            <div className="border-4 border-green-400 bg-black p-2 lg:col-span-2">
              <img 
                src="/api/stars-per-repo" 
                alt="Stars per Repo" 
                className="w-full h-auto"
                style={{imageRendering: 'pixelated'}}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <section className="border-4 border-green-400 bg-black p-6">
              <h2 className="text-xl font-bold text-green-400 mb-4" style={{fontFamily: 'monospace', letterSpacing: '0.1em'}}>
                🔌 API ENDPOINTS
              </h2>
              <div className="bg-black border-2 border-green-400 p-4 font-mono text-sm">
                <code className="text-green-400">GET /api/line?days=7</code>
                <br />
                <code className="text-green-400">GET /api/streak</code>
                <br />
                <code className="text-green-400">GET /api/languages</code>
                <br />
                <code className="text-green-400">GET /api/repos-per-language</code>
                <br />
                <code className="text-green-400">GET /api/stars-per-language</code>
                <br />
                <code className="text-green-400">GET /api/commits-per-language</code>
                <br />
                <code className="text-green-400">GET /api/commits-per-repo</code>
                <br />
                <code className="text-green-400">GET /api/stars-per-repo</code>
              </div>
            </section>

            <section className="border-4 border-green-400 bg-black p-6">
              <h2 className="text-xl font-bold text-green-400 mb-4" style={{fontFamily: 'monospace', letterSpacing: '0.1em'}}>
                ⚙ PARAMETERS
              </h2>
              <ul className="space-y-2 text-green-400">
                <li className="flex items-center">
                  <span className="font-mono bg-black border-2 border-green-400 text-green-400 px-2 py-1 mr-2" style={{fontFamily: 'monospace'}}>days</span>
                  <span style={{fontFamily: 'monospace'}}>NUMBER OF DAYS FOR ACTIVITY GRAPH</span>
                </li>
              </ul>
            </section>
          </div>

          <section className="border-4 border-green-400 bg-black p-6 mt-8">
            <h2 className="text-xl font-bold text-green-400 mb-4" style={{fontFamily: 'monospace', letterSpacing: '0.1em'}}>
              📌 USAGE IN GITHUB README
            </h2>
            <div className="bg-black border-2 border-green-400 p-4 font-mono text-sm text-green-400">
              <pre>{`![Daily Coding](http://localhost:3000/api/line?days=7)
![Streak](http://localhost:3000/api/streak)
![Languages](http://localhost:3000/api/languages)`}</pre>
            </div>
          </section>
        </main>

        <footer className="text-center mt-16 text-green-400 border-t-4 border-green-400 pt-8">
          <p style={{fontFamily: 'monospace', letterSpacing: '0.1em'}}>
            [BUILT WITH NEXT.JS, TYPESCRIPT, AND PIXEL PERFECT CSS]
          </p>
        </footer>
      </div>
    </div>
  );
}
