import "../styles/globals.css";
import "../styles/fonts.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Ensure Tailwind CDN is loaded
    if (typeof window !== 'undefined' && !(window as any).tailwind) {
      const script = document.createElement('script');
      script.src = 'https://cdn.tailwindcss.com';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <>
      <Head>
        <script src="https://cdn.tailwindcss.com" async />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <style>{`
          /* Retro Pixel Game Styling */
          .retro-title {
            font-family: 'Minecrafter', 'Retro Gaming', monospace !important;
            letter-spacing: 0.15em !important;
            text-transform: uppercase !important;
            -webkit-font-smoothing: none !important;
            -moz-osx-font-smoothing: unset !important;
          }
          
          .retro-text {
            font-family: 'Determination', 'Retro Gaming', monospace !important;
            letter-spacing: 0.05em !important;
            -webkit-font-smoothing: none !important;
            -moz-osx-font-smoothing: unset !important;
          }
          
          .retro-3d {
            font-family: 'Botsmatic 3D', 'Minecrafter', monospace !important;
            letter-spacing: 0.1em !important;
            -webkit-font-smoothing: none !important;
            -moz-osx-font-smoothing: unset !important;
          }
          
          /* Ensure pixelated rendering */
          * {
            image-rendering: pixelated;
            image-rendering: -moz-crisp-edges;
            image-rendering: crisp-edges;
          }
          
          /* Ensure basic styles are applied */
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
          }
          .grid {
            display: grid;
          }
          .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .gap-6 { gap: 1.5rem; }
          .mb-8 { margin-bottom: 2rem; }
          .mb-12 { margin-bottom: 3rem; }
          .p-2 { padding: 0.5rem; }
          .p-4 { padding: 1rem; }
          .p-8 { padding: 2rem; }
          .px-4 { padding-left: 1rem; padding-right: 1rem; }
          .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
          .text-center { text-align: center; }
          .inline-block { display: inline-block; }
          .border-4 { border-width: 4px; }
          .border-green-400 { border-color: rgb(74 222 128); }
          .bg-black { background-color: rgb(0 0 0); }
          .text-green-400 { color: rgb(74 222 128); }
          .text-white { color: rgb(255 255 255); }
          .text-2xl { font-size: 1.5rem; line-height: 2rem; }
          .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
          .font-bold { font-weight: 700; }
          .min-h-screen { min-height: 100vh; }
          .w-full { width: 100%; }
          .h-full { height: 100%; }
          .object-contain { object-fit: contain; }
          @media (min-width: 768px) {
            .md\\:text-base { font-size: 1rem; line-height: 1.5rem; }
            .md\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
            .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          }
          @media (min-width: 1024px) {
            .lg\\:col-span-2 { grid-column: span 2 / span 2; }
            .lg\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            .md\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
          }
        `}</style>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
