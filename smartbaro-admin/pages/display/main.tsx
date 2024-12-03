import type { GetServerSideProps, NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import Layout from '@/components/Layout';
import { api, setContext } from '@/libs/axios';

const DesignMain: NextPage = (props: any) => {
    const router = useRouter();
    const [posts, setPosts] = useState(props.response.list);

    const nav_id = 14;

    useEffect(() => {
        if (sessionStorage.getItem(router.asPath) || '{}' !== '{}') {
            setPosts(JSON.parse(sessionStorage.getItem(router.asPath) || '{}').data);
            return () => {
                const scroll = parseInt(JSON.parse(sessionStorage.getItem(router.asPath) || '{}').scroll_y, 10);
                window.scrollTo(0, scroll);
                sessionStorage.removeItem(router.asPath);
            };
        }
    }, [posts, router.asPath]);

    const create_main_json = async itme => {
        try {
            if (!confirm('기존 생성된 데이터는 사라지고 새로 생성된 데이터가 적용됩니다. 계속 하시겠습니까 ?')) {
                return;
            }

            const p = {
                area: itme.area,
                area_class: itme.area_class,
                display_type: itme.display_type,
                cont_uid: itme.cont_uid,
                cont_type: itme.cont_type,
            };

            const { data } = await api.post(`/be/admin/main/create`, p);
            alert(data.msg);
        } catch (e: any) {}
    };

    const goEditContents = item => {
        if (item.cont_type == 'BOARD') {
            router.push(`/board/posts/list?board_uid=${item.cont_uid}`);
        } else if (item.cont_type == 'DOCTOR') {
            router.push(`/medical/doctor/list`);
        } else {
            router.push(`/display/banner/list?uid=${item.uid}&nav_id=${nav_id}`);
        }
    };

    const openMainEdit = (item: any) => {
        window.open(`/display/edit?uid=${item.uid}`, '메인 상세', 'width=1120,height=800,location=no,status=no,scrollbars=yes');
    };

    return (
        <Layout user={props.user} title="국제바로병원 인트라넷" nav_id={nav_id} crumbs={['디자인 관리', '메인관리']}>
            <div className="col-table-header">
                <div className="text-left">총 {posts?.length} 개</div>
                <div className="text-right">
                    <button
                        type="button"
                        className="btn-newadd"
                        onClick={() => {
                            openMainEdit({ uid: 0 });
                        }}
                    >
                        <i className="far fa-plus-square me-2"></i> 메인영역 추가하기
                    </button>
                </div>
            </div>

            <div className="col-table">
                <div className="col-table-th grid grid-cols-12 sticky top-16 bg-gray-100">
                    <div className="">No</div>
                    <div className="col-span-2">코드명</div>
                    <div className="col-span-2">영역명</div>
                    <div className="col-span-3">미리보기/배너수정</div>
                    <div className="">기능</div>
                    <div className="">생성</div>
                </div>
                {posts.map((v, i) => (
                    <div key={i} className="col-table-td grid grid-cols-12 bg-white transition duration-300 ease-in-out hover:bg-gray-100">
                        <div className="flex-col">
                            <div>{v.area_sort}</div>
                        </div>
                        <div className="col-span-2">{v.area}</div>
                        <div className="col-span-2">{v.area_name}</div>
                        <div className="col-span-3">
                            <div
                                className="cursor-pointer"
                                onClick={() => {
                                    goEditContents(v);
                                }}
                            >
                                <img src={v.area_thumb} />
                            </div>
                        </div>
                        <div className="flex-col">
                            <div className="hidden">[{v.is_display == 'T' ? '진열' : '미진열'}]</div>
                            <button
                                type="button"
                                className="text-blue-500 underline"
                                onClick={() => {
                                    openMainEdit(v);
                                }}
                            >
                                수정
                            </button>
                        </div>
                        <div className="">
                            <button
                                onClick={() => {
                                    create_main_json(v);
                                }}
                                className="text-blue-500 underline"
                            >
                                생성
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
    var request = {
        display_type: ctx.query.display_type,
    };
    var response: any = {};
    try {
        const { data } = await api.post(`/be/admin/main/list`, request);
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

export default DesignMain;
