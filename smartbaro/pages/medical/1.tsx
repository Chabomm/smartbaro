import type { GetServerSideProps, NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import Seo from '@/components/Seo';
import { checkNumeric, cls, getAgentDevice } from '@/libs/utils';
import TabNavi from '@/components/TabNavi';
import Link from 'next/link';
import { api, setContext } from '@/libs/axios';

const Medical_1: NextPage = (props: any) => {
    const nav_id = '/medical/1';
    const nav_name = '진료예약안내';
    const page_header = { nav_id: nav_id, sub_title: nav_name };

    const [category, setCategory] = useState<any>([]);

    useEffect(() => {
        if (JSON.stringify(props) !== '{}') {
            props.response.category_list.forEach(function (v: any, i: any) {
                v.doctor_list = [];
                props.response.doctor_list.forEach(function (vv: any, ii: any) {
                    if (vv.cate_uid.includes(checkNumeric(v.uid))) {
                        v.doctor_list.push(vv);
                    }
                });
            });

            setCategory(props.response.category_list);
        }
    }, [props]);

    return (
        <Layout title={nav_name} nav_id={nav_id} device={props.device}>
            <Seo title={nav_name} />
            <PageHeader params={page_header} device={props.device} />
            <Breadcrumb nav_id={nav_id} device={props.device} />

            <div className="subject sub-py">진료예약안내</div>

            <TabNavi nav_id="/company/4/000" />

            <section className="site-width padding-y all-schedule-wrap">
                <div className="section_subject pb-20">진료시간표</div>
                <div className="overflow-x-auto">
                    <div className="grid-table">
                        <div className="grid grid-cols-5 gap-0">
                            {/* <div className="col-span-1 grid-table-th">과목</div> */}
                            <div className="col-span-5 border-b">
                                <div className="grid grid-cols-6 gap-0">
                                    <div className="col-span-1 grid-table-th">의료진</div>
                                    <div className="col-span-1 grid-table-th">구분</div>
                                    <div className="col-span-4 grid-table-th">진료일정</div>
                                </div>
                            </div>
                        </div>
                        {category?.map(
                            (v, i) =>
                                v.is_reserve == 'T' && (
                                    <div key={`category_${i}`}>
                                        <div className="grid-table-td bg-point text-white font-bold">
                                            <div className="">{v.cate_name}</div>
                                        </div>
                                        <div className="grid grid-cols-5 gap-0 border-t border-gray-400">
                                            <div className="col-span-5">
                                                {v.doctor_list.map((vv, ii) => (
                                                    <div
                                                        key={`doctor_list_${ii}`}
                                                        className={cls('grid grid-cols-6 gap-0', ii + 1 == v.doctor_list.length ? '' : 'border-b border-gray-400')}
                                                    >
                                                        <div className="col-span-1 grid-table-td !p-0">
                                                            <div className="text-center h-full py-6" style={{ backgroundColor: '#f3f4f8' }}>
                                                                <div className="doctor-name">{vv.name}</div>
                                                                <div>{vv.position}</div>
                                                            </div>
                                                            {/* <div className="flex items-center" style={{ backgroundColor: '#f3f4f8' }}>
                                                                <div className="img-box">
                                                                    <img src={vv.profile} alt="" className="w-full mx-auto" />
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                        <div className="col-span-1 grid-table-td !p-0">
                                                            <div className="w-full py-2 border-b">
                                                                <div className="week">오전</div>
                                                            </div>
                                                            <div className="w-full py-2">
                                                                <div className="week">오후</div>
                                                            </div>
                                                        </div>
                                                        <div className="col-span-4 grid-table-td !p-0">
                                                            <div className="w-full py-2 border-b">
                                                                <div className="grid grid-cols-5 gap-0">
                                                                    <div className={cls('week', `${vv.am_week_1}` == '진료' ? 'on' : '')}>월</div>
                                                                    <div className={cls('week', `${vv.am_week_2}` == '진료' ? 'on' : '')}>화</div>
                                                                    <div className={cls('week', `${vv.am_week_3}` == '진료' ? 'on' : '')}>수</div>
                                                                    <div className={cls('week', `${vv.am_week_4}` == '진료' ? 'on' : '')}>목</div>
                                                                    <div className={cls('week', `${vv.am_week_5}` == '진료' ? 'on' : '')}>금</div>
                                                                </div>
                                                            </div>
                                                            <div className="w-full py-2">
                                                                <div className="grid grid-cols-5 gap-0">
                                                                    <div className={cls('week', `${vv.pm_week_1}` == '진료' ? 'on' : '')}>월</div>
                                                                    <div className={cls('week', `${vv.pm_week_2}` == '진료' ? 'on' : '')}>화</div>
                                                                    <div className={cls('week', `${vv.pm_week_3}` == '진료' ? 'on' : '')}>수</div>
                                                                    <div className={cls('week', `${vv.pm_week_4}` == '진료' ? 'on' : '')}>목</div>
                                                                    <div className={cls('week', `${vv.pm_week_5}` == '진료' ? 'on' : '')}>금</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )
                        )}
                    </div>
                </div>
            </section>

            <section className="guide-wrap bg-section-gray padding-y" id="time">
                <div className="white-box site-width">
                    <div className="section_subject">전화 예약</div>
                    <div className="phone_num flex items-center">
                        <img src="/resource/images/medical/desktop/icon_infor01.png" className="me-3" alt="" />
                        032)722-8585 <span className="text-stone-700 page_header_subtitle">(내선 1번)</span>
                    </div>
                    <div className="">
                        <img src={`/resource/images/medical/${props.device}/reserve_time.png`} alt="" />
                    </div>
                    <div className="my-10">
                        <img src={`/resource/images/medical/${props.device}/reserve_program.png`} alt="" />
                    </div>
                    <div className="lg:w-1/2">
                        <div className="subject-bar !mb-5">대표번호 및 내선번호 안내</div>
                        <div className="normal-text grid grid-cols-2 gap-2">
                            <div className="flex justify-between">
                                <div className="col-auto">· 진료예약 및 상담</div>
                                <div className="font-bold ">1번</div>
                            </div>
                            <div className="flex justify-between">
                                <div className="">· 원무과</div>
                                <div className="font-bold">4번</div>
                            </div>
                            <div className="flex justify-between">
                                <div className="">· 종합검진</div>
                                <div className="font-bold ">2번</div>
                            </div>
                            <div className="flex justify-between">
                                <div className="">· 응급실차량지원</div>
                                <div className="font-bold">5번</div>
                            </div>
                            <div className="flex justify-between">
                                <div className="">· 서류발급</div>
                                <div className="font-bold ">3번</div>
                            </div>
                            <div className="flex justify-between">
                                <div className="">· 기타문의</div>
                                <div className="font-bold">0번</div>
                            </div>
                            <div className="col-span-2">· 입원실은 병실 호수 (ex 601호: 내선번호 601)</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="site-width padding-y online-guide-wrap">
                <div className="contents-width">
                    <div className="section_subject">인터넷 예약</div>
                    <div className="txt-box">
                        <div className="">
                            <div className="mb-5 must">환자분들의 편의를 위해 온라인으로 초진/재진 예약시스템을 운영하고 있습니다.</div>
                            <div className="must">예약이 접수되면 전문 상담원이 직접 전화를 걸어 상담해 드립니다.</div>
                        </div>
                        <div className="text-center">
                            <button>
                                <Link href={'/medical/2'}>
                                    <i className="fas fa-heartbeat fa-lg text-white me-3"></i> 온라인 진료예약
                                </Link>
                            </button>
                        </div>
                    </div>
                    <img src={`/resource/images/medical/${props.device}/online-reserve-program.png`} alt="" className="mx-auto" />
                </div>
            </section>

            <section className="bg-section-gray padding-y">
                <div className="white-box site-width">
                    <div className="section_subject">
                        전화/인터넷 <b>예약시 유의사항</b>
                    </div>
                    <div className="normal-text !leading-loose">
                        <div className="must mb-5">예약당일, 예약시간 10분전 원무과로 오셔서 예약상황을 확인하고 진료를 받으시면 됩니다.</div>
                        <div className="must mb-5">예약변경이나 취소는 예약일 하루 전까지 예약 담당자에게 통보해주시기 바랍니다.</div>
                        <div className="must">진료예약 사항을 예약일 하루 전 핸드폰을 통해 전송해 드리고 있습니다.</div>
                    </div>
                </div>
            </section>

            <section className="site-width padding-y">
                <div className="contents-width">
                    <div className="section_subject">주요 전화번호 안내</div>
                    <div className="contact-grid grid-cols-2 lg:grid-cols-4 ">
                        <div className="py-2" style={{ background: '#e5e5e5' }}>
                            진료예약
                        </div>
                        <div className="py-2 border">722-8585</div>
                        <div className="py-2" style={{ background: '#e5e5e5' }}>
                            원무과
                        </div>
                        <div className="py-2 border">722-8533</div>
                        <div className="py-2" style={{ background: '#e5e5e5' }}>
                            수술상담
                        </div>
                        <div className="py-2 border">722-8539</div>
                        <div className="py-2" style={{ background: '#e5e5e5' }}>
                            제증명 서류신청
                        </div>
                        <div className="py-2 border">722-8650</div>
                        <div className="py-2" style={{ background: '#e5e5e5' }}>
                            종합검진센터
                        </div>
                        <div className="py-2 border">722-8642, 722-8575</div>
                        <div className="py-2" style={{ background: '#e5e5e5' }}>
                            입/퇴원 수속
                        </div>
                        <div className="py-2 border">722-8645</div>
                        <div className="py-2" style={{ background: '#e5e5e5' }}>
                            물리치료/도수치료
                            <br />
                            예약 및 접수
                        </div>
                        <div className="py-2 border">
                            <div className="flex justify-center items-center h-full">722-8916</div>
                        </div>
                        <div className="py-2" style={{ background: '#e5e5e5' }}>
                            <div className="flex justify-center items-center h-full">자보산재</div>
                        </div>
                        <div className="py-2 border">
                            <div className="flex justify-center items-center h-full">722-8532</div>
                        </div>
                    </div>
                    <div className="contact-grid grid-cols-2 lg:grid-cols-4 ">
                        <div className="py-2" style={{ background: '#e5e5e5' }}>
                            1층 안내데스크
                        </div>
                        <div className="py-2 border">722-8888</div>
                        <div className="py-2" style={{ background: '#e5e5e5' }}>
                            5병동 간호사실
                        </div>
                        <div className="py-2 border">722-8500</div>
                        <div className="py-2" style={{ background: '#e5e5e5' }}>
                            관절센터 간호사실
                        </div>
                        <div className="py-2 border">722-8940</div>
                        <div className="py-2" style={{ background: '#e5e5e5' }}>
                            6병동 간호사실
                        </div>
                        <div className="py-2 border">722-8600</div>
                        <div className="py-2" style={{ background: '#e5e5e5' }}>
                            척추센터 간호사실
                        </div>
                        <div className="py-2 border">722-8937</div>
                        <div className="py-2" style={{ background: '#e5e5e5' }}>
                            7병동 간호사실
                        </div>
                        <div className="py-2 border">722-8700</div>
                        <div className="py-2" style={{ background: '#e5e5e5' }}>
                            내과센터 간호사실
                        </div>
                        <div className="py-2 border">722-8886</div>
                    </div>

                    <div className="normal-text pt-10">
                        <i className="fas fa-exclamation-triangle text-red-500 me-2"></i>
                        진료시간(평일 오전 09:00 ~ 오후 06:00/토요일 오전 09:00 ~ 오후 01:00/점심시간 오후 01:00 ~ 오후 02:00) 외에는 병동 간호사실과 원무과로만 전화연결이 가능하여
                        대표전화 032)722-8585는 24시간 전화 가능합니다.
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    setContext(ctx);
    const device = getAgentDevice(ctx);
    var request: any = {
        uid: 0,
    };
    var response: any = {};
    try {
        const { data } = await api.post(`/be/doctor/schedule/list`, request);
        response = data;
    } catch (e: any) {
        if (typeof e.redirect !== 'undefined') {
            return { redirect: e.redirect };
        }
    }
    return {
        props: { request, response, device: device },
    };
};

export default Medical_1;
