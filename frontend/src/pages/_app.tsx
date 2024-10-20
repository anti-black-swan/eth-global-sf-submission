import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

import { config } from '../wagmi';
import MyNav from '../components/mynav';
import Head from 'next/head';

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (    
    <ChakraProvider>      
      <WagmiProvider config={config}>
        <QueryClientProvider client={client}>
          <RainbowKitProvider>
            <MyNav />                
            <Component {...pageProps} />
            </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ChakraProvider>
  );
}

export default MyApp;
