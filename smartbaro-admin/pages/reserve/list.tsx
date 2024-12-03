import type { GetServerSideProps, NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { api, setContext } from '@/libs/axios';
import { useRouter } from 'next/router';
import Datepicker from 'react-tailwindcss-datepicker';
import { cls, checkNumeric } from '@/libs/utils';

import Layout from '@/components/Layout';
import useForm from '@/components/form/useForm';
import ListPagenation from '@/components/bbs/ListPagenation';

const ReserveList: NextPage = (props: any) => {
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
        setPosts(newPosts.list);
    };

    const getPostsData = async p => {
        try {
            const { data } = await api.post(`/be/admin/reserve/list`, p);
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
            state: '',
            estate: '',
            checked: [],
            create_at: {
                startDate: null,
                endDate: null,
            },
            rev_date: {
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
            const { data } = await api.post(`/be/admin/reserve/filter`);
            setFilter(data);
        } catch (e: any) {}
    };

    const searching = async () => {
        params.filters = s.values;
        let newPosts = await getPostsData(params);
        setPosts(newPosts.list);
        s.setValues({ ...s.values, checked: [], estate: '' });
    };

    const fnEditState = async () => {
        try {
            if (s.values.estate == '') {
                alert('변경할 상태를 선택해주세요.');
                return;
            }

            if (s.values.checked.length == 0) {
                alert('변경할 예약을 선택해주세요.');
                return;
            }

            const p = {
                uid: s.values.checked,
                state: s.values.estate,
            };

            const { data } = await api.post(`/be/admin/reserve/edit`, p);
            s.setSubmitting(false);
            if (data.code == 200) {
                alert(data.msg);
                searching();
            } else {
                alert(data.msg);
            }
        } catch (e: any) {}
    };

    const fnAllChecked = el => {
        let params = { ...s.values.checked };
        params = [];
        if (el.target.checked) {
            posts.map((v: any) => {
                params.push(v.uid);
            });
        }

        s.setValues({ ...s.values, checked: params });
    };

    return (
        <Layout user={props.user} title="국제바로병원 인트라넷" nav_id={12} crumbs={['병원관리', '진료예약 내역']}>
            <form onSubmit={fn.handleSubmit} noValidate className="w-full border py-4 px-6 rounded shadow-md bg-white mt-5">
                <div className="grid grid-cols-4 gap-6">
                    <div className="col-span-1">
                        <label className="form-label">등록일 조회</label>
                        <Datepicker
                            containerClassName="relative w-full text-gray-700 border border-gray-300 rounded"
                            inputName="create_at"
                            value={s.values.create_at}
                            i18n={'ko'}
                            onChange={fn.handleChangeDateRange}
                            primaryColor={'blue'}
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="form-label">예약일 조회</label>
                        <Datepicker
                            containerClassName="relative w-full text-gray-700 border border-gray-300 rounded"
                            inputName="rev_date"
                            value={s.values.rev_date}
                            i18n={'ko'}
                            onChange={fn.handleChangeDateRange}
                            primaryColor={'blue'}
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="form-label">예약 상태</label>
                        <select name="state" value={s.values?.state || ''} onChange={fn.handleChange} className={cls(s.errors['state'] ? 'border-danger' : '', 'form-select')}>
                            <option value="">전체</option>
                            {filter.state?.map((v, i) => (
                                <option key={i} value={v.key}>
                                    {v.value}
                                </option>
                            ))}
                        </select>
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
                        <button className="btn-search col-span-2" disabled={s.submitting}>
                            <i className="fas fa-search mr-3" style={{ color: '#ffffff' }}></i> 검색
                        </button>
                    </div>
                </div>
            </form>

            <div className="col-table-header">
                <div className="text-left">
                    총 {params.page_total} 개 중 {params.page_size}개
                </div>
                <div className="text-right flex items-center">
                    <div className="font-bold me-3">선택한 진료예약을</div>
                    <div className="w-32 me-3">
                        <select name="estate" value={s.values?.estate || ''} onChange={fn.handleChange} className={cls(s.errors['state'] ? 'border-danger' : '', 'form-select')}>
                            <option value=""></option>
                            {filter.state?.map((v, i) => (
                                <option key={i} value={v.key}>
                                    {v.value}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="font-bold me-3">로 변경</div>
                    <button type="button" className="btn-newadd" onClick={fnEditState}>
                        상태 변경
                    </button>
                </div>
            </div>

            <div className="col-table">
                <div className="col-table-th grid grid-cols-11 sticky top-16 bg-gray-100">
                    {/* col-span-2 */}
                    <div className="">
                        <label className="flex justify-center items-center w-full h-full">
                            <input
                                type="checkbox"
                                name="all_check"
                                onClick={e => {
                                    fnAllChecked(e);
                                }}
                                checked={s.values.checked.length === posts?.length ? true : false}
                            />
                        </label>
                    </div>
                    <div className="">UID</div>
                    <div className="">환자명</div>
                    <div className="col-span-2">회원정보</div>
                    <div className="">진료구분</div>
                    <div className="">진료과</div>
                    <div className="">담당의</div>
                    <div className="">예약일</div>
                    <div className="">등록일</div>
                    <div className="">상태</div>
                </div>

                {posts?.map((v: any, i: number) => (
                    <div key={i} className="col-table-td grid grid-cols-11 bg-white transition duration-300 ease-in-out hover:bg-gray-100">
                        <div className="">
                            <label className="flex justify-center items-center w-full h-full">
                                <input
                                    id={`checked-${i}`}
                                    checked={s.values?.checked.filter(p => p == v.uid) == checkNumeric(v.uid) ? true : false}
                                    onChange={fn.handleCheckboxGroupForInteger}
                                    type="checkbox"
                                    value={v.uid}
                                    name="checked"
                                />
                            </label>
                        </div>
                        <div className="">{v.uid}</div>
                        <div className="">{v.user_name}</div>
                        <div className="col-span-2">
                            <div>
                                <div>
                                    {v.birth}({v.gender})
                                </div>
                                <div>{v.mobile}</div>
                                <div>
                                    {v.addr} {v.addr_detail}
                                </div>
                            </div>
                        </div>
                        <div className="">{v.is_first}</div>
                        <div className="">{v.cate_name}</div>
                        <div className="">{v.name}</div>
                        <div className="">
                            <div>
                                <div>{v.rev_date}</div>
                                <div>{v.rev_time}</div>
                            </div>
                        </div>
                        <div className="">{v.create_at}</div>
                        <div className="">{v.state}</div>
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
        const { data } = await api.post(`/be/admin/reserve/list`, request);
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

export default ReserveList;
