import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ReactSortable } from 'react-sortablejs';

import { api } from '@/libs/axios';

const CategoryManagement = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init,
        get_cate_posts,
    }));

    const [posts, setPosts] = useState<any>([]);
    const [item, setItem] = useState<any>({});
    const [sort, setSort] = useState<any>([]);
    const [sortDiff, setSortDiff] = useState<boolean>(false);

    function init(v: any) {
        setItem(v);
    }

    useEffect(() => {
        if (JSON.stringify(item) !== '{}') {
            getCateList();
        }
    }, [item]);

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

    const getCateList = async () => {
        try {
            const { data } = await api.post(`/be/admin/cate/list`, { table_name: item.table_name, table_uid: item.table_uid });
            setPosts(data.list);
            setSort([]);
            setSortDiff(false);
        } catch (e: any) {}

        // axios.defaults.headers.common['Authorization'] = `Bearer ${getToken(null)}`;
        // const getData = axios.post(`/be/admin/cate/list`, { table_name: item.table_name, table_uid: item.table_uid });
        // const result = (await getData).data;
        // setPosts(result.list);
        // setSort([]);
        // setSortDiff(false);
    };

    const get_cate_posts = () => {
        return posts;
    };

    const openCategoryEdit = (uid: any) => {
        window.open(
            `/display/category/edit?table_uid=${item.table_uid}&table_name=${item.table_name}&cuid=${uid.uid}`,
            '메인 상세',
            'width=1120,height=800,location=no,status=no,scrollbars=yes'
        );
    };

    const sortableOptions: any = {
        animation: 150,
        handle: '.handle',
    };

    const sorting = async () => {
        try {
            const p = {
                mode: 'SORT',
                table_uid: item.table_uid,
                table_name: item.table_name,
                sort_array: sort,
            };

            const { data } = await api.post(`/be/admin/cate/edit`, p);
            if (data.code == 200) {
                alert(data.msg);
            } else {
                alert(data.msg);
            }
        } catch (e: any) {}
    };

    return (
        <>
            {sortDiff && (
                <div className="py-3 bg-red-50 border rounded my-5 flex justify-center items-center sticky top-16 z-50">
                    <button
                        type="button"
                        className="btn-newadd btn-sm"
                        onClick={() => {
                            sorting();
                        }}
                    >
                        카테고리 순서 적용하기
                    </button>
                    <div className="text-red-600 font-bold ml-5">순서가 변경되었습니다. 적용하기 버튼을 클릭하여 저장해 주세요</div>
                </div>
            )}
            <div className="col-table-header">
                <div className="text-left">총 {posts.list?.length} 개</div>
                <div className="text-right">
                    <button
                        type="button"
                        className="btn-newadd"
                        onClick={() => {
                            openCategoryEdit({ uid: 0 });
                        }}
                    >
                        <i className="far fa-plus-square me-2"></i> 카테고리 추가하기
                    </button>
                </div>
            </div>

            <div className="col-table mb-10">
                <div className="col-table-th grid grid-cols-5 sticky top-16 bg-gray-100">
                    <div className="">순서</div>
                    <div className="">고유번호</div>
                    <div className="">카테고리명</div>
                    <div className="">아이콘</div>
                    <div className="">기능</div>
                </div>
                <ReactSortable {...sortableOptions} list={posts} setList={setPosts}>
                    {posts?.map((v: any, i: number) => (
                        <div key={v.uid} className="col-table-td grid grid-cols-5 bg-white transition duration-300 ease-in-out hover:bg-gray-100">
                            <div className="handle flex-col cursor-pointer">
                                <div className="flex items-center justify-center border p-3 rounded bg-slate-50">
                                    <i className="fas fa-sort me-2"></i>
                                    <div className="font-semibold">{v.cate_sort}</div>
                                </div>
                            </div>

                            <div className="">{v.uid}</div>
                            <div className="">{v.cate_name}</div>
                            <div className="">
                                <img src={v.cate_icon} style={{ maxWidth: '100%', maxHeight: '100px' }} />
                            </div>
                            <div className="">
                                <button
                                    type="button"
                                    onClick={() => {
                                        openCategoryEdit(v);
                                    }}
                                >
                                    수정
                                </button>
                            </div>
                        </div>
                    ))}
                </ReactSortable>
            </div>
            {/* <CategoryEdit ref={refCategoryEdit} /> */}
        </>
    );
});

CategoryManagement.displayName = 'CategoryManagement';
export default CategoryManagement;
