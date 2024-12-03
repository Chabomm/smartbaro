/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    webpackDevMiddleware: config => {
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
        };
        return config;
    },
    images: {
        domains: ['resr.smartbaro.com', 'smartbaro.com', 'imagedelivery.net', 'localhost'],
    },
    async rewrites() {
        return [
            {
                source: '/be/:path*',
                destination: `${process.env.NEXT_PUBLIC_BACKEND}/be/:path*`,
            },
            {
                source: '/healthz',
                destination: '/api/health',
            },
            {
                source: '/resr/:path*',
                destination: 'https://resr.smartbaro.site/:path*',
            },
        ];
    },
    async redirects() {
        return [
            {
                source: '/sub/page/joint/3/1',
                destination: '/knee/8',
                permanent: false,
            },
            {
                source: '/sub/page/spine/4/1',
                destination: '/hipjoint/11',
                permanent: false,
            },
            {
                source: '/sub/page/screening/6/1',
                destination: '/screening/1',
                permanent: false,
            },
            {
                source: '/sub/page/company/1/7',
                destination: '/company/7',
                permanent: false,
            },
            {
                source: '/sub/page/spine/4/2/7',
                destination: '/cranial/1',
                permanent: false,
            },
            {
                source: '/sub/page/joint/3/1/1',
                destination: '/knee/8',
                permanent: false,
            },
            {
                source: '/bbs/board.php:path*',
                has: [
                    {
                        type: 'query',
                        key: 'bo_table',
                        value: 'notice',
                    },
                ],
                destination: '/bbs/news',
                permanent: false,
            },
            {
                source: '/bbs/board.php:path*',
                has: [
                    {
                        type: 'query',
                        key: 'bo_table',
                        value: 'star_gallery',
                    },
                ],
                destination: '/bbs/star',
                permanent: false,
            },
            {
                source: '/bbs/content.php:path*',
                has: [
                    {
                        type: 'query',
                        key: 'co_id',
                        value: 'provision',
                    },
                ],
                destination: '/terms/provision',
                permanent: false,
            },
            {
                source: '/sub/page/medical/2/1',
                destination: '/medical/1',
                permanent: false,
            },
            {
                source: '/sub/page/company/1/3',
                destination: '/company/4',
                permanent: false,
            },
            {
                source: '/sub/page/company/1/1',
                destination: '/company/1',
                permanent: false,
            },
            {
                source: '/sub/page/special/5/3',
                destination: '/knee/7',
                permanent: false,
            },
        ];
    },
};

module.exports = nextConfig;
