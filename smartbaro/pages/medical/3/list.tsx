import React, { useState, useEffect } from 'react';
import { api } from '@/libs/axios';
import { getToken, getAgentDevice } from '@/libs/utils';
import { useRouter } from 'next/router';
import ListPagenation from '@/components/bbs/ListPagenation';
import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import Seo from '@/components/Seo';
import PageHeader from '@/components/PageHeader';
import Breadcrumb from '@/components/Breadcrumb';

function Medical_3_list(props: any) {
    const nav_id = '/medical/3/list';
    const nav_name = '제증명서류발급';
    const page_header = { nav_id: nav_id, sub_title: nav_name };

    const router = useRouter();
    const [params, setParams] = useState<any>({});
    const [posts, setPosts] = useState<any>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (sessionStorage.getItem(router.asPath) || '{}' !== '{}') {
                const reData = JSON.parse(sessionStorage.getItem(router.asPath) || '{}').data;
                setParams(reData.params);
                setPosts(reData.posts);
                const scroll = parseInt(JSON.parse(sessionStorage.getItem(router.asPath) || '{}').scroll_y, 10);
                let intervalRef = setInterval(() => {
                    window.scrollTo(0, scroll);
                    sessionStorage.removeItem(router.asPath);
                    clearInterval(intervalRef);
                }, 200);
            } else {
                getPagePost({
                    page: 1,
                    page_view_size: 0,
                    page_size: 0,
                    page_total: 0,
                    page_last: 0,
                    filters: {},
                });
            }
        }
    }, [router.asPath]);

    const getPagePost = async p => {
        let newPosts = await getPostsData(p);
        setPosts(newPosts.list);
    };

    const getPostsData = async p => {
        try {
            const { data } = await api.post(`/be/reserve/docs/list`, p);
            setParams(param => {
                param.page = data.page;
                param.page_size = data.page_size;
                param.page_view_size = data.page_view_size;
                param.page_total = data.page_total;
                param.page_last = data.page_last;
                return param;
            });
            return data;
        } catch (e) {}
    };

    function goDetail(uid: number) {
        // if (typeof window !== 'undefined') {
        //     sessionStorage.setItem(
        //         router.asPath,
        //         JSON.stringify({
        //             data: {
        //                 params: params,
        //                 posts: posts,
        //             },
        //             scroll_x: `${window.scrollX}`,
        //             scroll_y: `${window.scrollY}`,
        //         })
        //     );
        // }
        router.push(`/medical/3/${uid}`);
    }

    function goReg() {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(
                router.asPath,
                JSON.stringify({
                    data: {
                        params: params,
                        posts: posts,
                    },
                    scroll_x: `${window.scrollX}`,
                    scroll_y: `${window.scrollY}`,
                })
            );
        }
        router.push(`/medical/3/reg`);
    }

    return (
        <Layout title={nav_name} nav_id={nav_id} device={props.device}>
            <Seo title={nav_name} />
            <PageHeader params={page_header} device={props.device} />
            <Breadcrumb nav_id={nav_id} device={props.device} />
            <div className="subject padding-y">{nav_name}</div>
            <section className="site-width gall-area pb-20">
                <div className="grid-cols-2 table-top-wrap">
                    <div className="text-left">
                        총 {params.page_total} 개 중 {params.page_size}개
                    </div>
                    <div className="text-right">
                        <button className="board-btn" onClick={goReg}>
                            글쓰기
                        </button>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
                        <table className="board-table-wrap">
                            <thead className="border-t-2 border-t-slate-500 bg-section-gray">
                                <tr>
                                    <th scope="col" className="board-table-th">
                                        번호
                                    </th>
                                    <th scope="col" className="board-table-th">
                                        환자
                                    </th>
                                    <th scope="col" className="board-table-th">
                                        신청인
                                    </th>
                                    <th scope="col" className="board-table-th">
                                        연락처
                                    </th>
                                    <th scope="col" className="board-table-th">
                                        발급희망일
                                    </th>
                                    <th scope="col" className="board-table-th">
                                        상태
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="border-y-2 border-y-stone-200">
                                {posts?.map((v: any, i) => (
                                    <tr key={i} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                                        <td className="board-table-td">{v.uid}</td>
                                        <td className="board-table-td">
                                            <div
                                                className="cursor-pointer font-semibold"
                                                onClick={e => {
                                                    goDetail(v.uid);
                                                }}
                                            >
                                                {v.name}
                                            </div>
                                        </td>
                                        <td className="board-table-td">
                                            <div
                                                className="cursor-pointer font-semibold"
                                                onClick={e => {
                                                    goDetail(v.uid);
                                                }}
                                            >
                                                {v.proposer}
                                            </div>
                                        </td>
                                        <td className="board-table-td">
                                            <div>{v.proposer_tel}</div>
                                            <div>{v.proposer_mobile}</div>
                                        </td>
                                        <td className="board-table-td">{v.hope_at}</td>
                                        <td className="board-table-td">{v.state}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="my-5 text-right">
                    <button className="board-btn" onClick={goReg}>
                        글쓰기
                    </button>
                </div>

                <ListPagenation props={params} getPagePost={getPagePost} device={props.device} />
            </section>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
    return {
        props: { device: getAgentDevice(ctx) },
    };
};

export default Medical_3_list;
