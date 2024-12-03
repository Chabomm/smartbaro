import type { GetServerSideProps, NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Breadcrumb from '@/components/Breadcrumb';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import Seo from '@/components/Seo';
import TabNavi from '@/components/TabNavi';
import { cls, getAgentDevice } from '@/libs/utils';
import { api, setContext } from '@/libs/axios';

const Company_4: NextPage = (props: any) => {
    const router = useRouter();
    const nav_id = '/company/4';
    const nav_name = '의료진소개';
    const page_header = { nav_id: nav_id, sub_title: nav_name };

    const [posts, setPosts] = useState(props.response);

    useEffect(() => {
        if (sessionStorage.getItem(router.asPath) || '{}' !== '{}') {
            const scroll = parseInt(JSON.parse(sessionStorage.getItem(router.asPath) || '{}').scroll_y, 10);
            window.scrollTo(0, scroll);
            sessionStorage.removeItem(router.asPath);
        }
    }, [posts, router.asPath]);

    const goDoctorDetail = uid => {
        sessionStorage.setItem(
            router.asPath,
            JSON.stringify({
                scroll_x: `${window.scrollX}`,
                scroll_y: `${window.scrollY}`,
            })
        );
        router.push(`/company/4/detail/${uid}`);
    };

    return (
        <Layout title={nav_name} nav_id={nav_id} device={props.device}>
            <Seo title={nav_name} />
            <PageHeader params={page_header} device={props.device} />
            <Breadcrumb nav_id={nav_id} device={props.device} />

            <div className="subject sub-py">의료진 소개</div>

            <TabNavi nav_id={nav_id} />

            {posts.category_list?.map((v, i) => (
                <section key={i} className="site-width padding-y medical-wrap">
                    <div className="cate_tit">{v.cate_name}</div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {posts.doctor_list?.map(
                            (vv, ii) =>
                                vv.cate_uid.includes(v.uid) && (
                                    <div key={ii} className="medical-item">
                                        <div className="medical-box">
                                            <div
                                                className="doctor-img cursor-pointer"
                                                onClick={e => {
                                                    goDoctorDetail(vv.uid);
                                                }}
                                            >
                                                <img src={vv.profile} alt="" className="w-full" />
                                            </div>
                                            <div className="text-center relative">
                                                <div className="text-second doctor-cate-name">{v.cate_name}</div>
                                                <div className="text-bar doctor-name">
                                                    <b>{vv.name}</b> {vv.position}
                                                </div>
                                                <div className="py-5 px-2">
                                                    <div className="desc_box line-hidden-3">{vv.field_keyword}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={e => {
                                                goDoctorDetail(vv.uid);
                                            }}
                                            className={cls(
                                                'bg-second text-white font-semibold w-full py-2.5 flex items-center justify-center',
                                                props.device == 'desktop' ? 'text-lg' : 'text-sm'
                                            )}
                                        >
                                            프로필 보기
                                            <i className="fas fa-chevron-right ms-2 text-sm"></i>
                                        </button>
                                    </div>
                                )
                        )}
                    </div>
                </section>
            ))}
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
        const { data } = await api.post(`/be/doctor/list`, request);
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

export default Company_4;
