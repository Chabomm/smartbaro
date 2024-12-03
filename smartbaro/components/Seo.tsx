import Head from 'next/head';

export default function Seo({ title }) {
    const meta = {
        site_name: '국제바로병원(구.바로병원)',
        author: '국제바로병원(구.바로병원)',
        description: '인공관절, 목허리디스크,두통뇌신경, 소아정형, 척추내시경, 비수술치료, 건강검진',
        keywords: '국제바로병원,인공관절, 목허리디스크,두통뇌신경, 소아정형, 척추내시경, 비수술치료, 건강검진, 바로병원',
        image: '/resource/images/common/logo_img.png',
        url: `${process.env.NEXT_PUBLIC_HOST}`,
    };

    const getJsonLdListItem = () => {
        return {
            __html: `
            {
                '@context': 'http://schema.org',
                '@type': 'ItemList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        "item": {
                            "@type": "Organization",
                            "name": "이정준 대표원장",
                            "image": "https://resr.smartbaro.com/medical/doctor/d59926fa-1229-49b5-9a19-b916a96adf6c.jpg",
                            "url": "https://smartbaro.com/company/4/detail/25"
                        },
                        "position": "1"
                    },
                    {
                        '@type': 'ListItem',
                        "item": {
                            "@type": "Organization",
                            "name": "정진원 병원장",
                            "image": "https://resr.smartbaro.com/medical/doctor/28e96cc7-6e28-4b91-8292-a0a9adaa5646.jpg",
                            "url": "https://smartbaro.com/company/4/detail/26"
                        },
                        "position": "2"
                    },
                    {
                        '@type': 'ListItem',
                        "item": {
                            "@type": "Organization",
                            "name": "고영원 병원장",
                            "image": "https://resr.smartbaro.com/medical/doctor/ce5028b8-1be9-4885-9375-aa08ff7ce826.jpg",
                            "url": "https://smartbaro.com/company/4/detail/27"
                        },
                        "position": "3"
                    },
                    {
                        '@type': 'ListItem',
                        "item": {
                            "@type": "Organization",
                            "name": "심규동 원장",
                            "image": "https://resr.smartbaro.com/medical/doctor/f388ebea-c636-496e-820c-2718ba59352d.jpg",
                            "url": "https://smartbaro.com/company/4/detail/41"
                        },
                        "position": "4"
                    },
                    {
                        '@type': 'ListItem',
                        "item": {
                            "@type": "Organization",
                            "name": "박민규 원장",
                            "image": "https://resr.smartbaro.com/medical/doctor/f838a7a3-d915-4e4c-b4fa-173f5c5db83e.jpg",
                            "url": "https://smartbaro.com/company/4/detail/28"
                        },
                        "position": "5"
                    },
                    {
                        '@type': 'ListItem',
                        "item": {
                            "@type": "Organization",
                            "name": "김민수 원장",
                            "image": "https://resr.smartbaro.com/medical/doctor/2feb3955-354f-4253-9056-d50d01292379.jpg",
                            "url": "https://smartbaro.com/company/4/detail/29"
                        },
                        "position": "6"
                    },
                    {
                        '@type': 'ListItem',
                        "item": {
                            "@type": "Organization",
                            "name": "반성수 원장",
                            "image": "https://resr.smartbaro.com/medical/doctor/cb2615be-8708-4207-84d3-a3a5508c7893.jpg",
                            "url": "https://smartbaro.com/company/4/detail/34"
                        },
                        "position": "7"
                    },
                    {
                        '@type': 'ListItem',
                        "item": {
                            "@type": "Organization",
                            "name": "김진성 원장",
                            "image": "https://resr.smartbaro.com/medical/doctor/f4606292-2820-4e1f-b3bc-22e5dde1957d.jpg",
                            "url": "https://smartbaro.com/company/4/detail/35"
                        },
                        "position": "8"
                    },
                    {
                        '@type': 'ListItem',
                        "item": {
                            "@type": "Organization",
                            "name": "김병관 원장",
                            "image": "https://resr.smartbaro.com/medical/doctor/a94d17e5-d702-4b49-9dac-d9372aff176d.jpg",
                            "url": "https://smartbaro.com/company/4/detail/50"
                        },
                        "position": "9"
                    },
                ],
            }
            `,
        };
    };

    return (
        <Head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no" />
            <meta name="robots" content="follow, index" />
            <meta property="site_name" content={meta.site_name} />
            <meta name="description" content={meta.description} />
            <meta name="keywords" content={meta.keywords} />
            <meta name="author" content={meta.author} />
            <meta property="og:title" content={`${title} | ${meta.site_name}`} />
            <meta property="og:site_name" content={title} />
            <meta property="og:type" content="website" />
            <meta property="og:description" content={meta.description} />
            <meta property="og:image" content={meta.image} />
            <meta property="og:url" content={meta.url} />
            <link rel="canonical" href={meta.url} />
            <meta name="naver-site-verification" content="095dc3c43a7cc3e18b38ef7eb88b481c9ac96e41" />
            <meta name="google-site-verification" content="jWcIoPRCBL1XPEipSscMcDSDdO2WrkInQ7tfYziGLNw" />
            <script type="application/ld+json" dangerouslySetInnerHTML={getJsonLdListItem()} key="item-jsonld" />
        </Head>
    );
}
