import type { GetServerSideProps, NextPage } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import Seo from '@/components/Seo';
import { cls, getAgentDevice } from '@/libs/utils';
import { api } from '@/libs/axios';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import { Pagination, FreeMode, Navigation, Thumbs } from 'swiper';
import TabNavi from '@/components/TabNavi';

const Company_5: NextPage = (props: any) => {
    const nav_id = '/company/5';
    const nav_name = '병원둘러보기';
    const page_header = { nav_id: nav_id, sub_title: nav_name };

    const [data, setData] = useState<any>([]);
    const [around, setAround] = useState([]);
    const [active, setActive] = useState(0);
    const [floorTxt, setFloorTxt] = useState('');
    const [thumbsSwiper, setThumbsSwiper] = useState<any>();
    const [swiper, setSwiper] = useState<any>();
    const [aroundEnd, setAroundEnd] = useState<boolean>(false);
    const [aroundFirst, setAroundFirst] = useState<boolean>(true);

    useEffect(() => {
        if (typeof data.CATEGORY_LIST !== 'undefined' && data.CATEGORY_LIST.length > 0) {
            getAround(data.CATEGORY_LIST[0].uid);
        }
    }, [data]);

    const getAround = uid => {
        setActive(uid);
        setAround(getListFilter(data.BANNER_LIST, 'cate_uid', uid));
        setAroundEnd(false);
        setAroundFirst(true);
    };

    function getListFilter(data, key, value) {
        return data.filter(function (object) {
            return object[key] === value;
        });
    }

    const getMainJson = async () => {
        try {
            const { data } = await api.get(`/resource/main/AROUND.json?${Math.floor(Date.now() / 1000)}`, {});
            setData(data);
        } catch (e) {}
    };

    useEffect(() => {
        getMainJson();
    }, []);

    useEffect(() => {
        if (active > 0) {
            if (active == 16) {
                setFloorTxt('<div class="floor-name">1층</div><div class="floor-txt">안내데스크 / 주차대기실 / 고객휴게실 / 호흡기전담 안심진료소</div>');
            } else if (active == 17) {
                setFloorTxt(
                    '<div class="floor-name">2층</div><div class="floor-txt">관절센터 / 척추 및 고관절센터 / 척추뇌신경센터 / 소아청소년정형센터 / 비수술정밀치료센터 / 접수|수납 / 제증명 / 입|퇴원수속</div>'
                );
            } else if (active == 18) {
                setFloorTxt('<div class="floor-name">3층</div><div class="floor-txt">내과센터 / 건강검진센터 / 영상의학과 / 초음파검사실 / 진단검사실</div>');
            } else if (active == 19) {
                setFloorTxt('<div class="floor-name">4층</div><div class="floor-txt">물리치료실(외래/입원) / 도수치료실 / 체외충격파실</div>');
            } else if (active == 20) {
                setFloorTxt('<div class="floor-name">5층</div><div class="floor-txt">병동(501호 ~ 515호)</div>');
            } else if (active == 21) {
                setFloorTxt('<div class="floor-name">6층</div><div class="floor-txt">간호간병통합서비스병동(601호 ~ 615호)</div>');
            } else if (active == 22) {
                setFloorTxt('<div class="floor-name">7층</div><div class="floor-txt">병동(701호 ~ 715호)</div>');
            } else if (active == 23) {
                setFloorTxt('<div class="floor-name">8층</div><div class="floor-txt">중앙수술실 / 보호자대기실 / 감염관리실 / 심사과</div>');
            } else if (active == 24) {
                setFloorTxt('<div class="floor-name">9층</div><div class="floor-txt">고객문화센터 / 국제협력센터 / 고객지원실 / 사회사업실 / 총무부 / 홍보실 / 대회의실</div>');
            } else if (active == 25) {
                setFloorTxt('<div class="floor-name">10층</div><div class="floor-txt">하늘정원</div>');
            } else {
                setFloorTxt('');
            }
        }
    }, [active]);

    return (
        <Layout title={nav_name} nav_id={nav_id} device={props.device}>
            <Seo title={nav_name} />
            <PageHeader params={page_header} device={props.device} />
            <Breadcrumb nav_id={nav_id} device={props.device} />

            <div className="subject sub-py">병원둘러보기</div>

            <TabNavi nav_id={nav_id} />

            <section className="site-width padding-y !pt-0 text-center">
                <div className="tabmenu-sticky">
                    <div className="tabmenu around-tabmenu !grid grid-cols-2 lg:grid-cols-10">
                        {data.CATEGORY_LIST?.map((v: any, i: number) => (
                            <div className="flex-grow">
                                <div key={i} className={`${v.uid == active ? 'on' : ' bg-white '} `}>
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => {
                                            getAround(v.uid);
                                        }}
                                    >
                                        {v.cate_name}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="around-cate-area" dangerouslySetInnerHTML={{ __html: floorTxt }}></div>

                <div className="SwiperWrapper around-swiper">
                    <Swiper
                        thumbs={{ swiper: thumbsSwiper }}
                        slidesPerView={1}
                        modules={[Pagination, FreeMode, Thumbs]}
                        pagination={{
                            el: '.swiper-pagination',
                            type: 'bullets',
                        }}
                        style={{ width: '1030px' }}
                        onBeforeInit={swipper => setSwiper(swipper)}
                        onSlideChange={e => {
                            e.isEnd ? setAroundEnd(true) : setAroundEnd(false);
                            e.isBeginning ? setAroundFirst(true) : setAroundFirst(false);
                        }}
                    >
                        {around?.map((v: any, i: number) => (
                            <div>
                                <div>안내데스크 / 주차대기실 / 고객휴게실 / 호흡기전담 안심진료소</div>
                                <SwiperSlide key={i}>
                                    <div className="w-full relative">
                                        <img alt="img" src={v.banner_src} className="" />
                                        <div className="img-desc">{v.banner_name}</div>
                                    </div>
                                </SwiperSlide>
                            </div>
                        ))}
                    </Swiper>
                    <div onClick={() => swiper?.slidePrev()} className="swiper_button_wrap swiper_button_prev">
                        <button className={cls(aroundFirst ? 'swiper_slide_fin' : '')} disabled={aroundFirst}></button>
                    </div>
                    <div onClick={() => swiper?.slideNext()} className="swiper_button_wrap swiper_button_next">
                        <button className={cls(aroundEnd ? 'swiper_slide_fin' : '')} disabled={aroundEnd}></button>
                    </div>
                </div>
                <Swiper
                    onSwiper={setThumbsSwiper}
                    loop={true}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="click-thumb-swiper"
                >
                    {around?.map((v: any, i: number) => (
                        <SwiperSlide key={i}>
                            <img alt="img" src={v.banner_src} className="" />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    return {
        props: { device: getAgentDevice(ctx) },
    };
};

export default Company_5;
