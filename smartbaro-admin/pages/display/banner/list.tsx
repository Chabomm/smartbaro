import type { GetServerSideProps, NextPage } from 'next';
import React, { useState, useEffect, useRef } from 'react';
import { api, setContext } from '@/libs/axios';
import { useRouter } from 'next/router';
import { checkNumeric } from '@/libs/utils';
import { ReactSortable } from 'react-sortablejs';

import Layout from '@/components/Layout';
import Categorymanagement from '@/components/category/management';

const MainBannerList: NextPage = (props: any) => {
    const router = useRouter();
    const { nav_id } = router.query;
    const [posts, setPosts] = useState<any>([]);
    const [main, setMain] = useState<any>({});
    const [sort, setSort] = useState<any>([]);
    const [sortDiff, setSortDiff] = useState<boolean>(false);

    useEffect(() => {
        if (JSON.stringify(props) !== '{}') {
            setPosts(props.response.list);
            setMain(props.response.main);
            openCategorymanagement(props);
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

    const create_main_json = async itme => {
        try {
            if (!confirm('기존 생성된 데이터는 사라지고 새로 생성된 데이터가 적용됩니다. 계속 하시겠습니까 ?')) {
                return;
            }
            const p = {
                site_id: itme.site_id,
                area: itme.area,
                area_class: itme.area_class,
                display_type: itme.display_type,
                cont_uid: itme.cont_uid,
                cont_type: itme.cont_type,
            };

            let url = '';
            if (main.display_type == 'MAIN') {
                url = '/be/admin/main/create';
            } else if (main.display_type == 'SUB') {
                url = '/be/admin/main/sub/create';
            }

            const { data } = await api.post(`${url}`, p);
            alert(data.msg);
        } catch (e: any) {}
    };

    // 배너 등록, 수정
    const openBannerEdit = (item: any) => {
        item.cate_list = refCategorymanagement.current.get_cate_posts().list;
        window.open(`/display/banner/edit?uid=${item.uid}&main_uid=${props.request.uid}`, '배너 상세', 'width=1120,height=800,location=no,status=no,scrollbars=yes,');
    };

    // 카테고리 list
    const refCategorymanagement = useRef<any>();
    function openCategorymanagement(item: any) {
        refCategorymanagement.current.init({
            table_name: 'T_MAIN',
            table_uid: item.request.uid,
        });
    }

    const sortableOptions = {
        animation: 150,
        handle: '.handle',
    };

    const sorting = async itme => {
        try {
            const p = {
                mode: 'SORT',
                main_uid: itme.uid,
                sort_array: sort,
            };
            const { data } = await api.post(`/be/admin/main/banner/edit`, p);
            if (data.code == 200) {
                alert(data.msg);
            } else {
                alert(data.msg);
            }
        } catch (e: any) {}
    };

    const getAreaClassName = area_class => {
        if (area_class == 'A') {
            return '웹&모바일';
        } else if (area_class == 'W') {
            return '웹(PC)';
        } else if (area_class == 'M') {
            return '모바일';
        }
    };

    return (
        <Layout user={props.user} title="국제바로병원 인트라넷" nav_id={nav_id} crumbs={['디자인 관리', '배너 관리']}>
            <div className="col-table mb-10">
                <div className="col-table-th grid grid-cols-4 sticky top-16 bg-gray-100">
                    <div className="">영역코드</div>
                    <div className="">영역명</div>
                    <div className="">메인생성</div>
                    <div className="">웹(PC) 영역 변경</div>
                </div>

                <div className="col-table-td grid grid-cols-4 bg-white transition duration-300 ease-in-out hover:bg-gray-100">
                    <div className="">{main?.area}</div>
                    <div className="">{main?.area_name}</div>
                    <div className="">
                        <button
                            onClick={() => {
                                create_main_json(main);
                            }}
                            className="text-blue-500 underline"
                        >
                            생성
                        </button>
                    </div>
                    <div className="">
                        <button className="text-blue-500 underline"></button>
                    </div>
                </div>
            </div>

            <Categorymanagement ref={refCategorymanagement} />

            {sortDiff && (
                <div className="py-3 bg-red-50 border rounded my-5 flex justify-center items-center sticky top-16 z-50">
                    <button
                        type="button"
                        className="btn-newadd btn-sm"
                        onClick={() => {
                            sorting(main);
                        }}
                    >
                        배너 순서 적용하기
                    </button>
                    <div className="text-red-600 font-bold ml-5">순서가 변경되었습니다. 적용하기 버튼을 클릭하여 저장해 주세요</div>
                </div>
            )}

            <div className="col-table-header">
                <div className="text-left">총 {posts.length} 개</div>
                <div className="text-right">
                    <button
                        type="button"
                        className="btn-newadd"
                        onClick={() => {
                            openBannerEdit({ uid: 0 });
                        }}
                    >
                        <i className="far fa-image me-2"></i> 배너 추가하기
                    </button>
                </div>
            </div>
            <div className="col-table">
                <div className="col-table-th grid grid-cols-12 sticky top-16 bg-gray-100">
                    <div className="">순서</div>
                    <div className="col-span-1">고유번호</div>
                    <div className="col-span-1">카테고리</div>
                    <div className="col-span-2">배너명</div>
                    <div className="col-span-1">플랫폼</div>
                    <div className="col-span-3">미리보기/배너수정</div>
                    <div className="col-span-1">노출상태</div>
                    <div className="col-span-1">기능</div>
                </div>

                <ReactSortable {...sortableOptions} list={posts} setList={setPosts}>
                    {posts?.map((v: any, i: number) => (
                        <div key={i} className="col-table-td grid grid-cols-12 bg-white transition duration-300 ease-in-out hover:bg-gray-100">
                            <div className="handle flex-col cursor-pointer">
                                <div className="flex items-center justify-center border p-3 rounded bg-slate-50">
                                    <i className="fas fa-sort me-2"></i>
                                    <div className="font-semibold">{v.sort}</div>
                                </div>
                            </div>
                            <div className="col-span-1">{v.uid}</div>
                            <div className="col-span-1">{v.cate_name}</div>
                            <div className="col-span-2">{v.banner_name}</div>
                            <div className="col-span-1">{getAreaClassName(v.area_class)}</div>
                            <div className="col-span-3">
                                <div className="">
                                    <img src={v.banner_src} style={{ maxWidth: '100%', maxHeight: '100px' }} />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div>[{v.is_display == 'T' ? '진열' : '미진열'}]</div>
                            </div>
                            <div className="col-span-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        openBannerEdit(v);
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
        uid: checkNumeric(ctx.query.uid),
    };

    var response: any = {};
    try {
        const { data } = await api.post(`/be/admin/main/banner/list`, request);
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

export default MainBannerList;
