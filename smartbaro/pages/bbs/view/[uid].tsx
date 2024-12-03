import type { GetServerSideProps, NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import nav from '../../api/nav.json';

import { api, setContext } from '@/libs/axios';
import { getAgentDevice } from '@/libs/utils';
import Breadcrumb from '@/components/Breadcrumb';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { useRouter } from 'next/router';
import Seo from '@/components/Seo';

const BBS_view: NextPage = (props: any) => {
    const router = useRouter();
    const { uid } = router.query;

    const [nav_id, setNav_id] = useState<string>('');
    const [nav_name, setNav_name] = useState<string>('');
    const [page_header, setPage_header] = useState<any>({});

    const [posts, setPosts] = useState<any>([]);

    useEffect(() => {
        if (JSON.stringify(props) !== '{}') {
            setPosts(props.response);
        }
        find_nav_id();
    }, [props]);

    const find_nav_id = () => {
        nav.navi_list.map((v, i) => {
            if (v.id == 'bbs') {
                v.children.map((vv, ii) => {
                    if (vv.id == props.response.board.front_url) {
                        setNav_id(vv.id);
                        setNav_name(vv.name);
                        setPage_header({ nav_id: vv.id, sub_title: vv.name });
                        // setHeaderParam({ ...headerParam, ['sub_title']: vv.name });
                    }
                });
            }
        });
    };

    function goBack() {
        router.back();
    }

    const routePosts = (uid: number) => {
        if (uid > 0) {
            router.replace(`/bbs/view/${uid}`);
        }
    };

    return (
        <Layout title={nav_name} nav_id={nav_id} device={props.device}>
            <Seo title={nav_name} />
            <PageHeader params={page_header} device={props.device} />
            <Breadcrumb nav_id={nav_id} device={props.device} />

            <div className="subject padding-y">{nav_name}</div>

            <section className="site-width pb-24 bbs-contents">
                <div className="border-y-2 border-second mb-20">
                    <div className="top-header">
                        <div>{posts.title}</div>
                        <div className="text-base font-normal text-gray-500">{posts.create_at}</div>
                    </div>
                    <div className="contents-box">
                        {posts.youtube && (
                            <div className="embed-container">
                                <iframe src={`https://www.youtube.com/embed/${posts.youtube}`} frameBorder="0" allowFullScreen></iframe>
                            </div>
                        )}
                        <div className="ck-content" dangerouslySetInnerHTML={{ __html: posts.contents }}></div>
                    </div>
                    <div className="border-t border-black bg-white px-5 mt-5">
                        <div className="flex justify-between py-2 border-b items-center">
                            <div className="w-20 flex-shrink-0">
                                <i className="fas fa-chevron-up me-2"></i>이전글
                            </div>
                            <div
                                onClick={e => {
                                    routePosts(posts?.prev_posts?.uid);
                                }}
                                className="flex-grow cursor-pointer truncate"
                            >
                                {posts?.prev_posts?.title}
                            </div>
                            {props.device == 'desktop' && <div className="text-gray-500">{posts?.prev_posts?.create_at}</div>}
                        </div>

                        <div className="flex justify-between py-2 border-b items-center">
                            <div className="w-20 flex-shrink-0">
                                <i className="fas fa-chevron-down me-2"></i>다음글
                            </div>
                            <div
                                onClick={e => {
                                    routePosts(posts?.next_posts?.uid);
                                }}
                                className="flex-grow cursor-pointer truncate"
                            >
                                {posts?.next_posts?.title}
                            </div>
                            {props.device == 'desktop' && <div className="text-gray-500">{posts?.next_posts?.create_at}</div>}
                        </div>
                    </div>
                </div>
                <div className="flex justify-between">
                    <button
                        onClick={() => {
                            goBack();
                        }}
                        className="inline-flex text-base px-8 py-2.5 text-white font-bold bg-second border"
                    >
                        목록으로
                    </button>
                </div>
            </section>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    setContext(ctx);
    const device = getAgentDevice(ctx);
    var request: any = {
        posts_uid: ctx.query.uid,
    };
    var response: any = {};
    try {
        const { data } = await api.post(`/be/front/posts/read`, request);
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

export default BBS_view;
