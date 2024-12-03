import type { GetServerSideProps, NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { api, setContext } from '@/libs/axios';
import { useRouter } from 'next/router';
import Datepicker from 'react-tailwindcss-datepicker';
import { ReactSortable } from 'react-sortablejs';
import { cls } from '@/libs/utils';

import Layout from '@/components/Layout';
import useForm from '@/components/form/useForm';

const MedicalDoctorList: NextPage = (props: any) => {
    const router = useRouter();
    const [params, setParams] = useState(props.request);
    const [posts, setPosts] = useState<any>([]);
    const [sort, setSort] = useState<any>([]);
    const [sortDiff, setSortDiff] = useState<boolean>(false);

    useEffect(() => {
        if (JSON.stringify(props) !== '{}') {
            setPosts(props.response.doctor_list);
        }
    }, [props]);

    useEffect(() => {
        if (sort.length == 0) {
            posts.map((v: any) => {
                setSort(current => [...current, v.uid]);
            });
        } else {
            var sort_diff = false;
            posts.map((v: any, i: number) => {
                if (v.uid != sort[i]) {
                    sort_diff = true;
                }
            });
            if (sort_diff) {
                setSort([]);
                posts.map((v: any) => {
                    setSort(current => [...current, v.uid]);
                });
                setSortDiff(sort_diff);
            }
        }
    }, [posts]);

    const { s, fn } = useForm({
        initialValues: {
            skeyword: '',
            skeyword_type: '',
            cate_uid: [],
            create_at: {
                startDate: null,
                endDate: null,
            },
        },
        onSubmit: async () => {
            await searching();
        },
    });

    const goEdit = (item: any) => {
        window.open(`/medical/doctor/edit?uid=${item.uid}`, '의료진 상세', 'width=1120,height=800,location=no,status=no,scrollbars=yes');
    };

    const sortableOptions = {
        animation: 150,
        handle: '.handle',
    };

    const sorting = async itme => {
        try {
            const p = {
                mode: 'SORT',
                sort_array: sort,
            };

            const { data } = await api.post(`/be/admin/medical/doctor/edit`, p);
            if (data.code == 200) {
                alert(data.msg);
            } else {
                alert(data.msg);
            }
        } catch (e: any) {}
    };

    const getPostsData = async p => {
        try {
            const { data } = await api.post(`/be/admin/medical/doctor/list`, p);
            return data;
        } catch (e: any) {}
    };

    const [filter, setFilter] = useState<any>({});

    useEffect(() => {
        getFilterContidion();
    }, []);

    const getFilterContidion = async () => {
        try {
            const { data } = await api.post(`/be/admin/medical/doctor/filter`);
            setFilter(data);

            const copy = { ...s.values };
            copy.cate_uid = data.cate_uid.map(row => row.checked && row.key);
            s.setValues(copy);
        } catch (e: any) {}
    };

    const searching = async () => {
        params.filters = s.values;
        let newPosts = await getPostsData(params);
        setPosts(newPosts.doctor_list);

        const copy_sort: any = [];
        newPosts.doctor_list?.map((v: any) => {
            copy_sort.push(v.uid);
        });
        setSort(copy_sort);
    };

    function getCategoryName(cate_uids) {
        let returnVal = '';
        props.response.category_list.map((v: any, i: number) => {
            if (cate_uids.includes(v.uid)) {
                returnVal = returnVal + '<div>' + v.cate_name + '</div>';
            }
        });
        return returnVal;
    }

    return (
        <Layout user={props.user} title="국제바로병원 인트라넷" nav_id={10} crumbs={['병원관리', '의료진 관리']}>
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
                        <button type="button" className="btn-filter ml-3">
                            <i className="fas fa-stream"></i> 필터
                        </button>
                    </div>
                </div>

                <div className="checkbox_filter">
                    <div className="grid grid-cols-5 gap-6">
                        <div className="col-span-1">
                            <div className="title">진료과목</div>
                            <div className="checkboxs_wrap h-24 overflow-y-auto">
                                {filter.cate_uid?.map((v: any, i: number) => (
                                    <label key={i}>
                                        <input
                                            id={`cate_uid-${i}`}
                                            onChange={fn.handleCheckboxGroup}
                                            type="checkbox"
                                            value={v.key}
                                            checked={s.values.cate_uid.includes(v.key)}
                                            name="cate_uid"
                                        />
                                        <span className="font-bold">{v.value}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {sortDiff && (
                <div className="py-5">
                    <button
                        type="button"
                        className="btn-newadd"
                        onClick={() => {
                            sorting(posts);
                        }}
                    >
                        배너 순서 적용하기
                    </button>
                    <div className="text-red-600 font-bold ml-5">순서가 변경되었습니다. 적용하기 버튼을 클릭하여 저장해 주세요</div>
                </div>
            )}

            <div className="col-table-header">
                <div className="text-left">총 {posts?.length} 개</div>
                <div className="text-right">
                    <button
                        type="button"
                        className="btn-newadd"
                        onClick={() => {
                            goEdit({ uid: 0 });
                        }}
                    >
                        <i className="far fa-plus-square me-2"></i> 의료진 추가하기
                    </button>
                </div>
            </div>

            <div className="col-table">
                <div className="col-table-th grid grid-cols-9 sticky top-16 bg-gray-100">
                    {/* col-span-2 */}
                    <div className="">순서</div>
                    <div className="">UID</div>
                    <div className="">진료과목</div>
                    <div className="">의료진명</div>
                    <div className="">직책</div>
                    <div className="">프로필</div>
                    <div className="col-span-2">대표키워드</div>
                    <div className="">상세보기</div>
                </div>

                <ReactSortable {...sortableOptions} list={posts} setList={setPosts}>
                    {posts?.map((v: any, i: number) => (
                        <div key={i} className="col-table-td grid grid-cols-9 bg-white transition duration-300 ease-in-out hover:bg-gray-100">
                            <div className="handle flex-col cursor-pointer">
                                <div className="flex items-center justify-center border p-3 rounded bg-slate-50">
                                    <i className="fas fa-sort me-2"></i>
                                    <div className="font-semibold">{v.sort}</div>
                                </div>
                            </div>
                            <div className="">{v.uid}</div>
                            <div className="flex-col" dangerouslySetInnerHTML={{ __html: getCategoryName(v.cate_uid) }}></div>
                            <div className="">{v.name}</div>
                            <div className="">{v.position}</div>
                            <div className="">
                                <img src={v.profile} style={{ maxWidth: '100%', maxHeight: '100px' }} />
                            </div>
                            <div className="col-span-2">{v.field_keyword}</div>

                            <div className="">
                                <button
                                    type="button"
                                    className="text-blue-500 underline"
                                    onClick={() => {
                                        goEdit(v);
                                    }}
                                >
                                    수정
                                </button>
                            </div>
                        </div>
                    ))}
                </ReactSortable>
            </div>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    setContext(ctx);
    var request: any = {};
    var response: any = {};
    try {
        const { data } = await api.post(`/be/admin/medical/doctor/list`, request);
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

export default MedicalDoctorList;
