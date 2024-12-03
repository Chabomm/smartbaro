import type { GetServerSideProps, NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { api, setContext } from '@/libs/axios';
import { useRouter } from 'next/router';
import Datepicker from 'react-tailwindcss-datepicker';
import { cls, checkNumeric } from '@/libs/utils';

import Layout from '@/components/Layout';
import useForm from '@/components/form/useForm';
import ListPagenation from '@/components/bbs/ListPagenation';
import ButtonSerach from '@/components/UIcomponent/ButtonSearch';

const LoginLogs: NextPage = (props: any) => {
    const router = useRouter();
    const [params, setParams] = useState(props.request);
    const [posts, setPosts] = useState(props.response.list);

    useEffect(() => {
        if (sessionStorage.getItem(router.asPath) || '{}' !== '{}') {
            setParams(JSON.parse(sessionStorage.getItem(router.asPath) || '{}').params);
            setPosts(JSON.parse(sessionStorage.getItem(router.asPath) || '{}').data);
            return () => {
                const scroll = parseInt(JSON.parse(sessionStorage.getItem(router.asPath) || '{}').scroll_y, 10);
                window.scrollTo(0, scroll);
                sessionStorage.removeItem(router.asPath);
            };
        }
    }, [posts, router.asPath]);

    const getPagePost = async p => {
        let newPosts = await getPostsData(p);
        console.log(newPosts);
        setPosts(newPosts.list);
    };

    const getPostsData = async p => {
        try {
            const { data } = await api.post(`/be/admin/setup/login/list`, p);
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
            create_date: {
                startDate: null,
                endDate: null,
            },
        },
        onSubmit: async () => {
            await searching();
        },
    });

    const [filter, setFilter] = useState<any>({});

    useEffect(() => {
        getFilterContidion();
    }, []);

    const getFilterContidion = async () => {
        try {
            const { data } = await api.post(`/be/admin/setup/login/filter`);
            setFilter(data);
        } catch (e: any) {}
    };

    const searching = async () => {
        params.filters = s.values;
        let newPosts = await getPostsData(params);
        console.log('newPosts', newPosts);
        setPosts(newPosts.list);
        s.setValues({ ...s.values, checked: [], estate: '' });
    };
    return (
        <Layout user={props.user} title="국제바로병원 인트라넷" nav_id={38} crumbs={['환경설정', '로그인이력']}>
            <form onSubmit={fn.handleSubmit} noValidate className="w-full border py-4 px-6 rounded shadow-md bg-white mt-5">
                <div className="grid grid-cols-4 gap-6">
                    <div className="col-span-1">
                        <label className="form-label">로그인 일시 조회</label>
                        <Datepicker
                            containerClassName="relative w-full text-gray-700 border border-gray-300 rounded"
                            inputName="create_date"
                            value={s.values.create_date}
                            i18n={'ko'}
                            onChange={fn.handleChangeDateRange}
                            primaryColor={'blue'}
                        />
                    </div>

                    <div className="col-span-4">
                        <select
                            name="skeyword_type"
                            value={s.values?.skeyword_type || ''}
                            onChange={fn.handleChange}
                            className={cls(s.errors['skeyword_type'] ? 'border-danger' : '', 'form-select mr-3')}
                            style={{ width: 'auto' }}
                        >
                            <option value="">전체</option>
                            {filter.skeyword_type?.map((v, i) => (
                                <option key={i} value={v.key}>
                                    {v.value}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            name="skeyword"
                            value={s.values?.skeyword || ''}
                            placeholder=""
                            onChange={fn.handleChange}
                            className={cls(s.errors['skeyword'] ? 'border-danger' : '', 'form-control mr-3')}
                            style={{ width: 'auto' }}
                        />
                        <ButtonSerach submitting={s.submitting}>
                            <i className="fas fa-search mr-3" style={{ color: '#ffffff' }}></i> 검색
                        </ButtonSerach>

                        {/* <button className="btn-search col-span-2" disabled={s.submitting}>
                            <i className="fas fa-search mr-3" style={{ color: '#ffffff' }}></i> 검색
                        </button> */}
                    </div>
                </div>
            </form>

            <div className="col-table-header">
                <div className="text-left">
                    총 {params.page_total} 개 중 {params.page_size}개
                </div>
            </div>

            <div className="col-table">
                <div className="col-table-th grid grid-cols-6 sticky top-16 bg-gray-100">
                    {/* col-span-2 */}
                    <div className="">UID</div>
                    <div className="col-span-2">아이디</div>
                    <div className="">아이피</div>
                    <div className="">로그인일시</div>
                    <div className="">ENV</div>
                </div>

                {posts?.map((v: any, i: number) => (
                    <div key={i} className="col-table-td grid grid-cols-6 bg-white transition duration-300 ease-in-out hover:bg-gray-100">
                        <div className="">{v.uid}</div>
                        <div className="col-span-2">{v.user_id}</div>
                        <div className="">{v.ip}</div>
                        <div className="">{v.create_date}</div>
                        <div className="">{v.profile}</div>
                    </div>
                ))}
            </div>
            <ListPagenation props={params} getPagePost={getPagePost} />
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    setContext(ctx);
    var request = {
        page: 1,
        page_size: 0,
        page_view_size: 0,
        page_total: 0,
        page_last: 0,
    };
    var response: any = {};
    try {
        const { data } = await api.post(`/be/admin/setup/login/list`, request);
        response = data;
        request.page = response.page;
        request.page_size = response.page_size;
        request.page_view_size = response.page_view_size;
        request.page_total = response.page_total;
        request.page_last = response.page_last;
    } catch (e: any) {
        if (typeof e.redirect !== 'undefined') {
            return { redirect: e.redirect };
        }
    }
    return {
        props: { request, response },
    };
};

export default LoginLogs;
