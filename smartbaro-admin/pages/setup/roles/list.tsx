import type { GetServerSideProps, NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { api, setContext } from '@/libs/axios';
import { useRouter } from 'next/router';

import Layout from '@/components/Layout';
import useForm from '@/components/form/useForm';

const SetupRolesList: NextPage = (props: any) => {
    const router = useRouter();
    const [params, setParams] = useState(props.request);
    const [posts, setPosts] = useState(props.response.list);

    const getPagePost = async p => {
        let newPosts = await getPostsData(p);
        setPosts(newPosts.list);
    };

    const getPostsData = async p => {
        try {
            const { data } = await api.post(`/be/admin/setup/manager/list`, p);
            setParams(param => {
                param.page = data.page;
                param.page_size = data.page_size;
                param.page_view_size = data.page_view_size;
                param.page_total = data.page_total;
                param.page_last = data.page_last;
                return param;
            });
            return data;
        } catch (e: any) {}
    };

    const { s, fn } = useForm({
        initialValues: {
            skeyword: '',
            skeyword_type: '',
            rec_type: [],
            state: [],
            create_at: {
                startDate: null,
                endDate: null,
            },
        },
        onSubmit: async () => {
            await searching();
        },
    });
    // useEffect(() => {
    //     getFilterContidion();
    // }, []);
    // const [filter, setFilter] = useState<any>({});

    // const getFilterContidion = async () => {
    //     try {
    //         const { data } = await api.post(`/be/admin/setup/manager/list/filter`);
    //         setFilter(data);
    //     } catch (e: any) {}
    // };

    const searching = async () => {
        params.filters = s.values;
        let newPosts = await getPostsData(params);
        setPosts(newPosts.list);
    };

    // const refAdminUserEdit = useRef<any>();
    // function openAdminUserEdit(item: any) {
    //     refAdminUserEdit.current.init(item, filter);
    // }

    const goEdit = (uid: number) => {
        window.open(`/setup/roles/edit?uid=${uid}`, '역할 상세정보', 'width=1120,height=800,location=no,status=no,scrollbars=yes');
    };

    return (
        <Layout user={props.user} title="국제바로병원 인트라넷" nav_id={9} crumbs={['환경설정', '역할관리']}>
            <div className="col-table-header">
                <div className="text-left"></div>
                <div className="text-right">
                    <button
                        type="button"
                        className="btn-newadd"
                        onClick={() => {
                            goEdit(0);
                        }}
                    >
                        역할등록
                    </button>
                </div>
            </div>

            <div className="col-table">
                <div className="col-table-th grid grid-cols-5 sticky top-16 bg-gray-100">
                    <div className="">고유번호</div>
                    <div className="">역할명</div>
                    <div className="col-span-2">배정된 메뉴 고유번호</div>
                    <div className="">수정하기</div>
                </div>

                {posts.map((v: any, i: number) => (
                    <div key={i} className="col-table-td grid grid-cols-5 bg-white transition duration-300 ease-in-out hover:bg-gray-100">
                        <div className="">{v.uid}</div>
                        <div className="">{v.name}</div>
                        <div className="col-span-2">{JSON.stringify(v.menus)}</div>
                        <div className="">
                            <button
                                type="button"
                                className="text-blue-500 underline"
                                onClick={() => {
                                    goEdit(v.uid);
                                }}
                            >
                                수정
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    setContext(ctx);
    var request: any = {};
    var response: any = {};
    try {
        const { data } = await api.post(`/be/admin/setup/manager/roles`, request);
        response = data;
    } catch (e: any) {
        if (typeof e.redirect !== 'undefined') {
            return { redirect: e.redirect };
        }
    }
    return {
        props: { request, response },
    };
};

export default SetupRolesList;
