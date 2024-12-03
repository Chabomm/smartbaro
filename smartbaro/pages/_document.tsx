import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
    return (
        <Html lang="ko">
            <Head>
                <Script
                    src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=0161684d75d250c4cb86a9910ef88e1e&libraries=services,clusterer&autoload=false"
                    strategy="beforeInteractive"
                ></Script>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
                <link rel="stylesheet" href="/resource/html/_lib/style.css" />
                <link rel="stylesheet" href="/resource/_lib/CKEditor.css" />
            </Head>
            <body>
                <Main />
                <NextScript />
                <span itemType="http://schema.org/Organization">
                    <link itemProp="url" href="https://www.smartbaro.com" />
                    <a itemProp="sameAs" href="https://blog.naver.com/zoz2639"></a>
                    <a itemProp="sameAs" href="https://www.instagram.com/ibaro_hospital/"></a>
                    <a itemProp="sameAs" href="https://www.youtube.com/channel/UC7MgSQPfQn4A9UFjRH6UDsg"></a>
                </span>
            </body>
        </Html>
    );
}
