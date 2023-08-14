import 'focus-visible'
import '@/styles/tailwind.css'
import Script from 'next/script'
import Head from 'next/head';
import React from 'react';

export default function App({ Component, pageProps }) {
  
  return (

  <>
  <Head>

        <meta charset="UTF-8" />
        <meta name="keywords" content="titla, meta, nextjs" />
        <meta name="author" content="Syamlal CM" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Bundl</title>
               
   </Head>
  <Component {...pageProps} />
  </>
  )
  
}
