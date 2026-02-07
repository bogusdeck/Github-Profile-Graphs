import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
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
        <style>{`
          /* Local Retro Pixel Fonts */
          @font-face {
            font-family: 'Retro Gaming';
            src: url('/fonts/RetroGaming.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          
          @font-face {
            font-family: 'Determination';
            src: url('/fonts/determination.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          
          @font-face {
            font-family: 'Minecrafter';
            src: url('/fonts/Minecrafter-MA3Dw.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          
          @font-face {
            font-family: 'Botsmatic3D';
            src: url('/fonts/Botsmatic3d-Exl8.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          
          /* Apply local pixel fonts */
          .retro-title {
            font-family: 'Minecrafter', 'Retro Gaming', monospace !important;
            letter-spacing: 0.15em !important;
            text-transform: uppercase !important;
            -webkit-font-smoothing: none !important;
            -moz-osx-font-smoothing: grayscale !important;
          }
          
          .retro-text {
            font-family: 'Determination', 'Retro Gaming', monospace !important;
            letter-spacing: 0.05em !important;
            -webkit-font-smoothing: none !important;
            -moz-osx-font-smoothing: grayscale !important;
          }
          
          /* Global font application */
          html, body {
            font-family: 'Determination', 'Retro Gaming', monospace !important;
          }
          
          h1, h2, h3, h4, h5, h6 {
            font-family: 'Minecrafter', 'Retro Gaming', monospace !important;
            letter-spacing: 0.15em !important;
          }
          
          /* Ensure pixelated rendering */
          * {
            image-rendering: pixelated;
            image-rendering: -moz-crisp-edges;
            image-rendering: crisp-edges;
          }
          
          /* Tailwind fallback styles */
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
          .gap-4 { gap: 1rem; }
          .gap-6 { gap: 1.5rem; }
          .mb-6 { margin-bottom: 1.5rem; }
          .mb-8 { margin-bottom: 2rem; }
          .mb-10 { margin-bottom: 2.5rem; }
          .mb-12 { margin-bottom: 3rem; }
          .mt-10 { margin-top: 2.5rem; }
          .p-2 { padding: 0.5rem; }
          .p-4 { padding: 1rem; }
          .p-8 { padding: 2rem; }
          .px-4 { padding-left: 1rem; padding-right: 1rem; }
          .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
          .pt-6 { padding-top: 1.5rem; }
          .text-center { text-align: center; }
          .inline-block { display: inline-block; }
          .border-2 { border-width: 2px; }
          .border-4 { border-width: 4px; }
          .border-t-2 { border-top-width: 2px; }
          .border-green-400 { border-color: rgb(74 222 128); }
          .border-green-800 { border-color: rgb(22 101 52); }
          .bg-black { background-color: rgb(0 0 0); }
          .bg-gray-900 { background-color: rgb(17 24 39); }
          .text-green-400 { color: rgb(74 222 128); }
          .text-green-600 { color: rgb(22 163 74); }
          .text-white { color: rgb(255 255 255); }
          .text-xs { font-size: 0.75rem; line-height: 1rem; }
          .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
          .text-2xl { font-size: 1.5rem; line-height: 2rem; }
          .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
          .font-bold { font-weight: 700; }
          .min-h-screen { min-height: 100vh; }
          .max-w-7xl { max-width: 80rem; }
          .mx-auto { margin-left: auto; margin-right: auto; }
          .w-full { width: 100%; }
          .h-full { height: 100%; }
          .rounded { border-radius: 0.25rem; }
          .overflow-hidden { overflow: hidden; }
          .relative { position: relative; }
          .absolute { position: absolute; }
          .top-2 { top: 0.5rem; }
          .left-4 { left: 1rem; }
          .z-10 { z-index: 10; }
          .flex { display: flex; }
          .items-center { align-items: center; }
          .justify-center { justify-content: center; }
          .object-contain { object-fit: contain; }
          @media (min-width: 640px) {
            .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
            .sm\\:p-6 { padding: 1.5rem; }
            .sm\\:text-sm { font-size: 0.875rem; line-height: 1.25rem; }
            .sm\\:text-2xl { font-size: 1.5rem; line-height: 2rem; }
            .sm\\:col-span-2 { grid-column: span 2 / span 2; }
            .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          }
          @media (min-width: 768px) {
            .md\\:text-base { font-size: 1rem; line-height: 1.5rem; }
            .md\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
            .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          }
          @media (min-width: 1024px) {
            .lg\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
            .lg\\:col-span-1 { grid-column: span 1 / span 1; }
            .lg\\:col-span-2 { grid-column: span 2 / span 2; }
            .lg\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          }
        `}</style>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
