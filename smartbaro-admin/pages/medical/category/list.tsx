import type { GetServerSideProps, NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { api, setContext } from '@/libs/axios';
import { useRouter } from 'next/router';
import { ReactSortable } from 'react-sortablejs';

import Layout from '@/components/Layout';

const MedicalCategoryList: NextPage = (props: any) => {
    const router = useRouter();
    const [params, setParams] = useState(props.request);
    const [posts, setPosts] = useState<any>([]);
    const [sort, setSort] = useState<any>([]);
    const [sortDiff, setSortDiff] = useState<boolean>(false);

    useEffect(() => {
        if (JSON.stringify(props) !== '{}') {
            setPosts(props.response.list);
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

    const goEdit = (item: any) => {
        window.open(`/medical/category/edit?uid=${item.uid}`, '진료과 상세', 'width=1120,height=800,location=no,status=no,scrollbars=yes');
    };

    const sortableOptions = {
        animation: 150,
        handle: '.handle',
    };

    const sorting = async itme => {
        try {
            const p = {
                mode: 'SORT',
                table_name: 'T_DOCTOR',
                sort_array: sort,
            };

            const { data } = await api.post(`/be/admin/medical/edit`, p);
            if (data.code == 200) {
                alert(data.msg);
            } else {
                alert(data.msg);
            }
        } catch (e: any) {}
    };

    return (
        <Layout user={props.user} title="국제바로병원 인트라넷" nav_id={11} crumbs={['진료과 관리', '진료과 관리 리스트']}>
            {sortDiff && (
                <div className="py-3 bg-red-50 border rounded my-5 flex justify-center items-center sticky top-16 z-50">
                    <button
                        type="button"
                        className="btn-newadd btn-sm"
                        onClick={() => {
                            sorting(posts);
                        }}
                    >
                        진료과 순서 적용하기
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
                        <i className="far fa-plus-square me-2"></i> 진료과 추가하기
                    </button>
                </div>
            </div>

            <div className="col-table">
                <div className="col-table-th grid grid-cols-7 sticky top-16 bg-gray-100">
                    <div className="">순서</div>
                    <div className="col-span-1">UID</div>
                    <div className="col-span-2">진료과명</div>
                    <div className="">아이콘</div>
                    <div className="">예약가능여부</div>
                    <div className="">상세보기</div>
                </div>

                <ReactSortable {...sortableOptions} list={posts} setList={setPosts}>
                    {posts?.map((v: any, i: number) => (
                        <div key={i} className="col-table-td grid grid-cols-7 bg-white transition duration-300 ease-in-out hover:bg-gray-100">
                            <div className="handle flex-col cursor-pointer">
                                <div className="flex items-center justify-center border p-3 rounded bg-slate-50">
                                    <i className="fas fa-sort me-2"></i>
                                    <div className="font-semibold">{v.cate_sort}</div>
                                </div>
                            </div>
                            <div className="">{v.uid}</div>
                            <div className="col-span-2">{v.cate_name}</div>
                            <div className="">
                                <img src={v.cate_icon} style={{ maxWidth: '100%', maxHeight: '100px' }} />
                            </div>
                            <div className="">{v.is_reserve == 'T' ? '가능' : '불가능'}</div>
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
    var request = {
        table_name: 'T_DOCTOR',
    };
    var response: any = {};
    try {
        const { data } = await api.post(`/be/admin/medical/list`, request);
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

export default MedicalCategoryList;
