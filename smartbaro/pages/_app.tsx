import Head from 'next/head';
import '../styles/globals.css';
import '../public/font/SUIT/SUIT.css';
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <link rel="preload" href="/font/SUIT/SUIT-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
                <link rel="preload" href="/font/SUIT/SUIT-ExtraBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
                <link rel="preload" href="/font/SUIT/SUIT-Heavy.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
                <link rel="preload" href="/font/SUIT/SUIT-Light.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
                <link rel="preload" href="/font/SUIT/SUIT-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
                <link rel="preload" href="/font/SUIT/SUIT-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
                <link rel="preload" href="/font/SUIT/SUIT-SemiBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}
