import type { NextPage, NextPageContext } from 'next';
import React, { useEffect, useState } from 'react';
import { api } from '@/libs/axios';
import { useRouter } from 'next/router';

import 'swiper/css';
import 'swiper/css/pagination';

import Layout from '@/components/Layout';
import Seo from '@/components/Seo';
import Medical from '@/components/home/Medical';
import Doctor from '@/components/home/Doctor';
import Counting from '@/components/home/Counting';
import Qook from '@/components/home/Qook';
import News from '@/components/home/News';
import Media from '@/components/home/Media';
import Location from '@/components/home/Location';
import Around from '@/components/home/Around';
import MainBanner from '@/components/home/MainBanner';
import FooterPartner from '@/components/home/FooterPartner';
import { checkNumeric, getAgentDevice } from '@/libs/utils';
import MainQuick from '@/components/home/MainQuick';
import MainPopup from '@/components/home/MainPopup';

const Index: NextPage = (props: any) => {
    const router = useRouter();
    const [data, setData] = useState<any>({});

    useEffect(() => {
        if (sessionStorage.getItem(router.asPath) || '{}' !== '{}') {
            const scroll = checkNumeric(JSON.parse(sessionStorage.getItem(router.asPath) || '{}').scroll_y);
            let intervalRef = setInterval(() => {
                window.scrollTo(0, scroll);
                sessionStorage.removeItem(router.asPath);
                clearInterval(intervalRef);
            }, 200);
        }
    }, [data]);

    useEffect(() => {
        if (sessionStorage.getItem(router.asPath) || '{}' !== '{}') {
            setData(JSON.parse(sessionStorage.getItem(router.asPath) || '{}').data);
        } else {
            getMainJson();
        }
    }, []);

    const getMainJson = async () => {
        try {
            const { data } = await api.get(`/resource/main/MAIN.json?${Math.floor(Date.now() / 1000)}`, {});
            setData(data);
        } catch (e) {}
    };

    const basic_pagination = {
        pagination: {
            el: '.swiper-pagination',
            type: 'custom',
        },
    };

    const fraction_pagination = {
        pagination: {
            el: '.swiper-pagination',
            type: 'fraction',
        },
    };

    var pagingSwiper = {
        pagination: {
            el: '.pagination_progress',
            type: 'progressbar',
        },
    };

    const galleryTop = {
        spaceBetween: 10, //슬라이드 간격
        pagination: {
            //페이징 사용자 설정
            el: '.pagination_bullet', //페이징 태그 클래스 설정
            clickable: true, //버튼 클릭 여부
            type: 'bullets', //페이징 타입 설정(종류: bullets, fraction, progress, progressbar)
            // Bullet Numbering 설정
            renderBullet: function (index, className) {
                return '<span class="' + className + '">' + (index + 1) + '</span>';
            },
        },
    };

    //Main Swiper로 progress Bar 제어
    // galleryTop.controller.control = pagingSwiper;

    const go_next_page = path => {
        sessionStorage.setItem(
            router.asPath,
            JSON.stringify({
                data: data,
                scroll_x: checkNumeric(window.scrollX),
                scroll_y: checkNumeric(window.scrollY),
            })
        );
        router.push(path);
    };

    return (
        <Layout title="index" nav_id="/" device={props.device}>
            <Seo title="홈" />
            <div className="absolute z-20 left-1/2 -translate-x-1/2 -top-20 lg:top-64">
                <div className="flex items-end">
                    {data.MAIN_POPUP_LIST?.map((v: any, i: number) => (
                        <MainPopup key={i} data={v} go_next_page={go_next_page} device={props.device} />
                    ))}
                </div>
            </div>
            <MainBanner data={data} go_next_page={go_next_page} device={props.device} />
            <Medical data={data} pagination={basic_pagination} go_next_page={go_next_page} device={props.device} />
            <Doctor data={data} pagination={basic_pagination} go_next_page={go_next_page} device={props.device} />
            <Counting data={data} device={props.device} />
            <Qook data={data} pagination={basic_pagination} go_next_page={go_next_page} device={props.device} />
            <News data={data} go_next_page={go_next_page} device={props.device} />
            <Media data={data} pagination={basic_pagination} go_next_page={go_next_page} device={props.device} />
            <Location device={props.device} />
            <Around go_next_page={go_next_page} device={props.device} />
            <MainQuick go_next_page={go_next_page} device={props.device} />
            <FooterPartner data={data} device={props.device} />
        </Layout>
    );
};

export const getServerSideProps = async (ctx: NextPageContext) => {
    return {
        props: { device: getAgentDevice(ctx) },
    };
};

export default Index;
