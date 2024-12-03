import type { GetServerSideProps, NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Datepicker from 'react-tailwindcss-datepicker';
import { cls } from '@/libs/utils';

import { api, setContext } from '@/libs/axios';
import Layout from '@/components/Layout';
import useForm from '@/components/form/useForm';
import ListPagenation from '@/components/bbs/ListPagenation';
import ButtonSerach from '@/components/UIcomponent/ButtonSearch';

const SetupManagerList: NextPage = (props: any) => {
    const router = useRouter();
    const [filter, setFilter] = useState<any>({});
    const [params, setParams] = useState<any>({});
    const [posts, setPosts] = useState<any>([]);

    useEffect(() => {
        setFilter(props.response.filter);
        setParams(props.response.params);
        getPagePost(props.response.params);
    }, []);

    const getPagePost = async p => {
        let newPosts = await getPostsData(p);
        setPosts(newPosts.list);
    };

    const getPostsData = async p => {
        try {
            const { data } = await api.post(`/be/admin/setup/manager/list`, p);
            setParams(data.params);
            return data;
        } catch (e: any) {}
    };

    const { s, fn } = useForm({
        initialValues: props.response.params.filters,
        onSubmit: async () => {
            await searching();
        },
    });

    const searching = async () => {
        params.filters = s.values;
        let newPosts = await getPostsData(params);
        setPosts(newPosts.list);
    };

    const goEdit = (uid: number) => {
        window.open(`/setup/manager/edit?uid=${uid}`, '관리자 수정', 'width=1120,height=800,location=no,status=no,scrollbars=yes');
    };

    const getStateTxt = (state: string) => {
        let state_txt = '';
        if (state == '100') {
            state_txt = '<span class="">승인대기</span>';
        } else if (state == '200') {
            state_txt = '<span class="text-blue-500">정상</span>';
        } else if (state == '300') {
            state_txt = '<span class="text-red-500">탈퇴</span>';
        }
        return state_txt;
    };

    return (
        <Layout user={props.user} title="국제바로병원 인트라넷" nav_id={8} crumbs={['환경설정', '관리자 리스트']}>
            <form onSubmit={fn.handleSubmit} noValidate className="w-full border py-4 px-6 rounded shadow-md bg-white mt-5">
                <div className="grid grid-cols-4 gap-6">
                    <div className="col-span-1">
                        <label className="form-label">관리자 상태</label>
                        <select name="state" value={s.values?.state || ''} onChange={fn.handleChange} className={cls(s.errors['state'] ? 'border-danger' : '', 'form-select')}>
                            <option value="">전체</option>
                            {filter.state?.map((v, i) => (
                                <option key={i} value={v.key}>
                                    {v.value}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="form-label">키워드 조회</label>
                        <div className="flex">
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
                        </div>
                    </div>
                </div>
                <div className="checkbox_filter">
                    <div className="grid grid-cols-5 gap-6">
                        <div className="col-span-1">
                            <div className="title">관리자 역할</div>
                            <div className="checkboxs_wrap h-24 overflow-y-auto">
                                {filter.roles?.map((v: any, i: number) => (
                                    <label key={i}>
                                        <input
                                            id={`roles-${i}`}
                                            onChange={fn.handleCheckboxGroupForInteger}
                                            type="checkbox"
                                            value={v.key}
                                            checked={s.values.roles.includes(v.key)}
                                            name="roles"
                                        />
                                        <span className="font-bold">{v.value}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div className="col-table-header">
                <div className="text-left">
                    총 {params?.page_total} 개 중 {params?.page_size}개
                </div>
                <div className="text-right">
                    <button
                        type="button"
                        className="btn-newadd"
                        onClick={() => {
                            goEdit(0);
                        }}
                    >
                        관리자등록
                    </button>
                </div>
            </div>

            <div className="col-table">
                <div className="col-table-th grid grid-cols-9 sticky top-16 bg-gray-100">
                    <div className="">UID</div>
                    <div className="">관리자ID</div>
                    <div className="">이름</div>
                    <div className="">부서</div>
                    <div className="col-span-2">역할</div>
                    <div className="">관리자상태</div>
                    <div className="">날짜</div>
                    <div className="">상세보기</div>
                </div>

                {posts?.map((v: any, i: number) => (
                    <div key={i} className="col-table-td grid grid-cols-9 bg-white transition duration-300 ease-in-out hover:bg-gray-100">
                        <div className="">{v.uid}</div>
                        <div className="">{v.user_id}</div>
                        <div className="">{v.user_name}</div>
                        <div className="">{v.depart}</div>
                        <div className="col-span-2">{v.roles_txt}</div>
                        <div className="">
                            <div className="" dangerouslySetInnerHTML={{ __html: getStateTxt(v.state) }}></div>
                        </div>
                        <div className="">{v.create_at}</div>
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
            <ListPagenation props={params} getPagePost={getPagePost} />
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    setContext(ctx);
    var request: any = {};
    var response: any = {};
    try {
        const { data } = await api.post(`/be/admin/setup/manager/list/init`, request);
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

export default SetupManagerList;
