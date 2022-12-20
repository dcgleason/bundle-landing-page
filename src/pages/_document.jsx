import { Html, Head, Main, Link, NextScript } from 'next/document'
import React from "react";

export default function Document() {
  return (
    <Html>
      <Head>
      <link
         href="https://fonts.googleapis.com/css2?family=Nothing+You+Could+Do&display=optional"
         rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}