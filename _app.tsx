import React from 'react';
import { TarotReadingProvider } from '@/context/TarotReadingContext';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TarotReadingProvider>
      <Component {...pageProps} />
    </TarotReadingProvider>
  );
}

export default MyApp; 