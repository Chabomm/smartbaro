import type { GetServerSideProps, NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { cls, getAgentDevice } from '@/libs/utils';
import Breadcrumb from '@/components/Breadcrumb';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import Seo from '@/components/Seo';
import { api, setContext } from '@/libs/axios';

const Company_4_uid: NextPage = (props: any) => {
    const router = useRouter();
    const { uid } = router.query;
    const nav_id = '/company/4/detail/' + uid;
    const nav_name = '의료진소개';
    const page_header = { nav_id: nav_id, sub_title: nav_name };

    const [posts, setPosts] = useState<any>([]);
    useEffect(() => {
        if (JSON.stringify(props) !== '{}') {
            setPosts(props.response);
        }
    }, [props]);

    return (
        <Layout title={nav_name} nav_id={nav_id} device={props.device}>
            <Seo title={nav_name} />
            <PageHeader params={page_header} device={props.device} />
            <Breadcrumb nav_id={nav_id} device={props.device} />
            {props.device == 'desktop' ? (
                <section className="" style={{ backgroundColor: '#f3f4f8' }}>
                    <div className="site-width">
                        <div className="flex items-end">
                            <div className="flex-1 py-32">
                                <div className="pb-20">
                                    <div className="text-2xl">{posts.cate_name}</div>
                                    <div className="text-3xl pt-2.5 pb-5">
                                        <b className="text-4xl">{posts.name}</b> {posts.position}
                                    </div>
                                    <div className="text-xl text-zinc-500" dangerouslySetInnerHTML={{ __html: posts.field_spec }}></div>
                                </div>
                                {posts.am_week_1 != null && (
                                    <table className="normal-text" style={{ width: '680px' }}>
                                        <tbody>
                                            <tr className="bg-second text-white">
                                                <th className="py-2.5">시간</th>
                                                <th className="py-2.5">월</th>
                                                <th className="py-2.5">화</th>
                                                <th className="py-2.5">수</th>
                                                <th className="py-2.5">목</th>
                                                <th className="py-2.5">금</th>
                                            </tr>
                                            <tr className="border-b border-second">
                                                <th className="py-3.5 font-normal">오전</th>
                                                <th className={cls('py-3.5', posts.am_week_1 == '진료' ? 'text-second' : '!font-normal')}>{posts.am_week_1}</th>
                                                <th className={cls('py-3.5', posts.am_week_2 == '진료' ? 'text-second' : '!font-normal')}>{posts.am_week_2}</th>
                                                <th className={cls('py-3.5', posts.am_week_3 == '진료' ? 'text-second' : '!font-normal')}>{posts.am_week_3}</th>
                                                <th className={cls('py-3.5', posts.am_week_4 == '진료' ? 'text-second' : '!font-normal')}>{posts.am_week_4}</th>
                                                <th className={cls('py-3.5', posts.am_week_5 == '진료' ? 'text-second' : '!font-normal')}>{posts.am_week_5}</th>
                                            </tr>
                                            <tr className="border-b-2 border-second">
                                                <th className="py-3.5 font-normal">오후</th>
                                                <th className={cls('py-3.5', posts.pm_week_1 == '진료' ? 'text-second' : '!font-normal')}>{posts.pm_week_1}</th>
                                                <th className={cls('py-3.5', posts.pm_week_2 == '진료' ? 'text-second' : '!font-normal')}>{posts.pm_week_2}</th>
                                                <th className={cls('py-3.5', posts.pm_week_3 == '진료' ? 'text-second' : '!font-normal')}>{posts.pm_week_3}</th>
                                                <th className={cls('py-3.5', posts.pm_week_4 == '진료' ? 'text-second' : '!font-normal')}>{posts.pm_week_4}</th>
                                                <th className={cls('py-3.5', posts.pm_week_5 == '진료' ? 'text-second' : '!font-normal')}>{posts.pm_week_5}</th>
                                            </tr>
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            <div className="" style={{ width: '440px' }}>
                                <img src={posts.profile} alt="" className="w-full" />
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                <section style={{ backgroundColor: '#f3f4f8' }}>
                    <div className="site-width padding-y !pb-0 text-center">
                        <div>
                            <div className="text-xl">{posts.cate_name}</div>
                            <div className="text-2xl pt-1 pb-2.5">
                                <b className="text-3xl">{posts.name}</b> {posts.position}
                            </div>
                            <div className="text-base text-zinc-500">{posts.field_spec}</div>
                        </div>
                        <div className="inline-block" style={{ width: '90%' }}>
                            <img src={posts.profile} alt="" className="w-full" />
                        </div>
                        {posts.am_week_1 != null && (
                            <table className="mb-14 normal-text mx-auto" style={{ width: '100%' }}>
                                <tbody>
                                    <tr className="bg-second text-white">
                                        <th className="py-2.5">시간</th>
                                        <th className="py-2.5">월</th>
                                        <th className="py-2.5">화</th>
                                        <th className="py-2.5">수</th>
                                        <th className="py-2.5">목</th>
                                        <th className="py-2.5">금</th>
                                    </tr>
                                    <tr className="border-b border-second">
                                        <th className="py-3.5 font-normal">오전</th>
                                        <th className={cls('py-3.5', posts.am_week_1 == '진료' ? 'text-second' : '!font-normal')}>{posts.am_week_1}</th>
                                        <th className={cls('py-3.5', posts.am_week_2 == '진료' ? 'text-second' : '!font-normal')}>{posts.am_week_2}</th>
                                        <th className={cls('py-3.5', posts.am_week_3 == '진료' ? 'text-second' : '!font-normal')}>{posts.am_week_3}</th>
                                        <th className={cls('py-3.5', posts.am_week_4 == '진료' ? 'text-second' : '!font-normal')}>{posts.am_week_4}</th>
                                        <th className={cls('py-3.5', posts.am_week_5 == '진료' ? 'text-second' : '!font-normal')}>{posts.am_week_5}</th>
                                    </tr>
                                    <tr className="border-b-2 border-second">
                                        <th className="py-3.5 font-normal">오후</th>
                                        <th className={cls('py-3.5', posts.pm_week_1 == '진료' ? 'text-second' : '!font-normal')}>{posts.pm_week_1}</th>
                                        <th className={cls('py-3.5', posts.pm_week_2 == '진료' ? 'text-second' : '!font-normal')}>{posts.pm_week_2}</th>
                                        <th className={cls('py-3.5', posts.pm_week_3 == '진료' ? 'text-second' : '!font-normal')}>{posts.pm_week_3}</th>
                                        <th className={cls('py-3.5', posts.pm_week_4 == '진료' ? 'text-second' : '!font-normal')}>{posts.pm_week_4}</th>
                                        <th className={cls('py-3.5', posts.pm_week_5 == '진료' ? 'text-second' : '!font-normal')}>{posts.pm_week_5}</th>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            )}

            <section className="bg-second">
                <div className="site-width padding-y">
                    <div className="section-tit">경력</div>
                    <div className="career-item grid-cols-1 lg:grid-cols-2" dangerouslySetInnerHTML={{ __html: posts.career }}></div>
                </div>
            </section>

            <section className="site-width padding-y">
                <div className="section-tit !text-black font-bold">학회 및 주요 활동</div>
                <div className="info-item grid-cols-1 lg:grid-cols-2 ">
                    {posts.info_list?.map((v, i) => (
                        <div key={i} className="">
                            <div className="subject-bar">{v.subject}</div>
                            <div className="info-txt-box" dangerouslySetInnerHTML={{ __html: v.contents }}></div>
                        </div>
                    ))}
                </div>
                <div></div>
            </section>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    setContext(ctx);
    const device = getAgentDevice(ctx);
    var request: any = {
        uid: ctx.query.uid,
    };
    var response: any = {};
    try {
        const { data } = await api.post(`/be/doctor/read`, request);
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

export default Company_4_uid;
