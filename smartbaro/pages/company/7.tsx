import type { GetServerSideProps, NextPage } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import Seo from '@/components/Seo';
import { getAgentDevice, staticReplace } from '@/libs/utils';
import { api, setContext } from '@/libs/axios';

import { Map, MapMarker } from 'react-kakao-maps-sdk';

const Company_7: NextPage = (props: any) => {
    const nav_id = '/company/7';
    const nav_name = '찾아오시는 길';
    const page_header = { nav_id: nav_id, sub_title: nav_name };

    return (
        <Layout title={nav_name} nav_id={nav_id} device={props.device}>
            <Seo title={nav_name} />
            <PageHeader params={page_header} device={props.device} />
            <Breadcrumb nav_id={nav_id} device={props.device} />
            <div className="subject sub-py">찾아오시는 길</div>

            <section className="site-width">
                <div className="location-con">
                    <div className="location-box">
                        <div className="mx-auto mb-12">
                            <img src="/resource/images/company/desktop/smartbaro_logo.png" alt="" className="mx-auto w-36" />
                        </div>
                        <div className="location-li">
                            <div className="pb-7">
                                <div className="txt-lg type-tit">
                                    <img src="/resource/images/main/desktop/icon_map01.png" alt="" className="h-7 me-2" />
                                    주소
                                </div>
                                <div className="txt-md">
                                    인천광역시 남동구 석정로 518
                                    <br />
                                    (인천광역시 남동구 간석동 895){' '}
                                </div>
                                <div className="txt-md text-gray-300">
                                    * 전용 주차타워에 무료 발렛주차 가능
                                    <br /> (외래진료, 수술 당일 무료 주차)
                                </div>
                            </div>
                        </div>
                        <div className="location-li">
                            <div className="py-7">
                                <div className="txt-lg type-tit">
                                    <img src="/resource/images/main/desktop/icon_map02.png" alt="" className="h-7 me-2" />
                                    대표번호
                                </div>
                                <div>
                                    <div className="num-tit">032)722-8585</div>
                                    <div className="txt-md text-gray-300 tracking-tight">(예약1번 / 검진2번 / 서류3번 / 기타0번)</div>
                                </div>
                            </div>
                        </div>
                        <div className="location-li !border-0">
                            <div className="pt-7">
                                <div className="txt-lg type-tit">
                                    <img src="/resource/images/main/desktop/icon_map03.png" alt="" className="h-7 me-2" />
                                    진료시간
                                </div>
                                <div className="txt-md pt-2 justify-between inline-flex">
                                    <div className="flex-none">
                                        <div>월요일</div>
                                        <div>화~금</div>
                                        <div>평일(야간)</div>
                                        <div>토요일</div>
                                        <div>(일요일/공휴일)</div>
                                    </div>
                                    <div className="sm_txt_box">
                                        <div>AM 08:30 ~ PM 18:00</div>
                                        <div>AM 09:00 ~ PM 18:00</div>
                                        <div>PM 18:00 ~ PM 20:00</div>
                                        <div>AM 08:30 ~ PM 13:00</div>
                                        <div>AM 09:00 ~ PM 18:00</div>
                                    </div>
                                </div>
                                <div className="txt-md text-gray-300">* 점심시간 13:00 ~ 14:00</div>
                            </div>
                        </div>
                    </div>
                    <Map className="location-map" center={{ lat: 37.465384, lng: 126.693342 }}>
                        <MapMarker position={{ lat: 37.465384, lng: 126.693342 }}>
                            <div style={{ position: 'absolute', left: '0', top: '0' }}>
                                <div className="mark-info">
                                    <span>국제바로병원</span>
                                </div>
                            </div>
                        </MapMarker>
                    </Map>
                </div>
            </section>

            <div dangerouslySetInnerHTML={{ __html: props.response }}></div>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    setContext(ctx);
    const device = getAgentDevice(ctx);
    var request: any = { path: 'company', name: '7.html' };
    var response: any = {};
    try {
        const { data } = await api.get(`/resource/html/${request.path}/${request.name}`);
        response = staticReplace(data, ctx);

        const agent_divece = getAgentDevice(ctx); // mobile, pc
        if (agent_divece == 'mobile') {
            response = response.replaceAll('#{DEVICE_GRID_COLS}', 'grid-cols-1');
        } else {
            response = response.replaceAll('#{DEVICE_GRID_COLS}', 'grid-cols-3');
        }
    } catch (e: any) {
        if (typeof e.redirect !== 'undefined') {
            return { redirect: e.redirect };
        }
    }
    return {
        props: { request, response, device: device },
    };
};

export default Company_7;
