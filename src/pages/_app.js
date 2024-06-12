import Head from 'next/head';
import Script from 'next/script'
import '@/styles/globals.css'
import c from '@/assets/constants';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta name="theme-color" content="#fff" />
      </Head>
      <Script defer data-domain={c.plausible_domain} src="https://plausible.io/js/script.tagged-events.js"></Script>
      <Component {...pageProps} />
    </>
  );
}
