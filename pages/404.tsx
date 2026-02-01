import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const Custom404: NextPage = () => {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | GitHub Profile Graphs</title>
        <meta name="description" content="GitHub Profile Graphs - 404 Page Not Found" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center px-4">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-green-400 mb-4" style={{ fontFamily: 'monospace' }}>
              404
            </h1>
            <div className="text-2xl text-green-400 mb-8" style={{ fontFamily: 'monospace' }}>
              PAGE NOT FOUND
            </div>
          </div>

          <div className="bg-gray-800 border-2 border-green-400 rounded-lg p-8 max-w-md mx-auto">
            <div className="mb-6">
              <div className="text-gray-300 mb-4" style={{ fontFamily: 'monospace' }}>
                <span className="text-green-400">$</span> find /github-graphs -name &quot;page&quot;
              </div>
              <div className="text-red-400" style={{ fontFamily: 'monospace' }}>
                find: &#39;/github-graphs/page&#39;: No such file or directory
              </div>
            </div>

            <div className="text-gray-300 mb-6" style={{ fontFamily: 'monospace' }}>
              <div className="mb-2">
                <span className="text-green-400">$</span> ls -la /pages/
              </div>
              <div className="text-gray-400 text-sm">
                index.tsx<br />
                api/<br />
                _document.tsx<br />
                _app.tsx
              </div>
            </div>

            <div className="text-yellow-400 mb-8" style={{ fontFamily: 'monospace' }}>
              ⚠️ The page you&apos;re looking for doesn&apos;t exist
            </div>

            <Link 
              href="/"
              className="inline-block bg-green-400 text-gray-900 px-6 py-3 rounded font-bold hover:bg-green-300 transition-colors"
              style={{ fontFamily: 'monospace' }}
            >
              cd ~/
            </Link>
          </div>

          <div className="mt-8 text-gray-500 text-sm" style={{ fontFamily: 'monospace' }}>
            GitHub Profile Graphs v1.0.0
          </div>
        </div>
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          background-color: #1a1a2e;
        }
      `}</style>
    </>
  );
};

export default Custom404;
