// https://gist.github.com/moogii/f4b3c35b22ca1b20fdcbc0fa770069ca
import { GetServerSidePropsContext } from 'next';
import { getUserIP } from './utils';
import axios, { AxiosError } from 'axios';
import Router from 'next/router';

export const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

const isServer = () => {
    return typeof window === 'undefined';
};

let context = <GetServerSidePropsContext>{};
export const setContext = (_context: GetServerSidePropsContext) => {
    context = _context;
};

api.interceptors.request.use(config => {
    /** config에는 위의 axiosInstance 객체를 이용하여 request를 보냈을떄의 모든 설정값들이 들어있다.
     * [활용]
     * 1. api요청의 경우 token이 필요한 경우가 있는데, 필요에 따른 토큰 정보들을 여기서 처리할 경우
     * 토큰에 대한 정보를 여러곳에서 처리하지 않아도 된다.
     * 2. 요청 method에 따른 외부로 드러내지 않고 처리하고 싶은 부분에 대한 작업이 가능
     */
    if (isServer()) {
        // html 파일 호출할때
        if (config?.url?.includes('/resource/') && config?.url?.includes('/html/')) {
            config.baseURL = `${process.env.NEXT_PUBLIC_HOST}`;
        } else if (config?.url?.includes('/resource/') && config?.url?.includes('MAIN.json')) {
            config.baseURL = `${process.env.NEXT_PUBLIC_HOST}`;
        } else {
            // backend 호출할때
            config.baseURL = `${process.env.NEXT_PUBLIC_BACKEND}`;
        }
        config.headers['x-user-ip'] = `${getUserIP(context)}`;
    } else {
        config.baseURL = ``;
    }
    return config;
});

api.interceptors.response.use(
    response => {
        // console.log('response', response);
        /** 요청을 보낸 뒤에 response(응답)이 오는 경우에 여기서 먼저 확인이 가능하다.
         * [활용]
         * 1. status-code가 정상적이어도 내용상의 이유로 에러처리가 필요한 경우
         * 2. 민감정보 또는 데이터에 대한 가공 작업
         */
        return response;
    },
    (error: AxiosError) => {
        // console.log('AxiosError', error);
        /** response응답 후에 status-code가 4xx, 5xx 처럼 에러를 나타내는 경우 해당 루트를 수행한다. */
        return sendErrorLog(error);
    }
);

const sendErrorLog = async (oError: any) => {
    try {
        const post_data = typeof oError.response?.config?.data === 'undefined' ? '{}' : oError.response?.config?.data;
        api.post(`/be/client_error`, {
            error_page: context.resolvedUrl,
            code: oError.code,
            headers: oError.config?.headers,
            status: oError.response?.status,
            status_text: oError.response?.statusText,
            axios_url: `${oError.config?.baseURL}${oError.config?.url}`,
            request_data: JSON.parse(post_data),
            response_data: oError.request.method.toUpperCase() == 'GET' ? '' : oError.response?.data,
        });
    } catch (e) {
        console.log(e);
    }

    // client side
    if (!isServer() && !Router.asPath.includes('/login')) {
        Router.push('/500');
    }

    // server side
    if (isServer()) {
        oError.redirect = {
            permanent: false,
            destination: '/500',
        };
    }

    return Promise.reject(oError);
};

export default api;
