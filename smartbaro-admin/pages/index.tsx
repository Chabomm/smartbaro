import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { cls, getToken } from '@/libs/utils';
import { api } from '@/libs/axios';

import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper';

const Home: NextPage = (props: any) => {
    const router = useRouter();
    const [params, setParams] = useState<any>({ instranet_tab: 11 });
    const [intranetPosts, setIntranetPosts] = useState<any>([]);
    const [intranetBoard, setIntranetBoard] = useState<any>({});
    const [intranetGallery, setIntranetGallery] = useState<any>([]);

    const [loginUser, setLoginUser] = useState<any>({});
    const [sessionHisyory, setSessionHisyory] = useState<any>([]);

    const [reserveList, setReserveList] = useState<any>([]);
    const [consultList, setConsultList] = useState<any>([]);
    const [vocList, setVocList] = useState<any>([]);

    useEffect(() => {
        getIntranetPostsData(params);
    }, []);

    const getIntranetPostsData = async p => {
        try {
            const { data } = await api.post(`/be/admin/dashboard/intranet`, p);
            setIntranetPosts(data.intranet_posts);
            setIntranetBoard(data.intranet_board);
            setParams(data.params);
            getDashboardData(params);
        } catch (e: any) {}
    };

    const getDashboardData = async p => {
        try {
            const { data } = await api.post(`/be/admin/dashboard/datas`, p);
            setParams(data.params);
            setIntranetGallery(data.intranet_gallery);
            setSessionHisyory(data.session_hisyory);
            setLoginUser({
                user_id: data.user_id,
                user_name: data.user_name,
            });

            setReserveList(data.reserve_list);
            setConsultList(data.consult_list);
            setVocList(data.voc_list);
        } catch (e: any) {}
    };

    const goIntranetPosts = uid => {
        getIntranetPostsData({ instranet_tab: uid });
    };

    const goIntranetBoard = (path_info: any) => {
        if (typeof path_info === 'string') {
            router.push(path_info);
        } else {
            router.push(intranetBoard.front_url);
        }
    };

    const viewPosts = (item: any) => {
        window.open(`/board/posts/view?uid=${item.uid}`, '게시물 상세', 'width=1120,height=800,location=no,status=no,scrollbars=yes');
    };

    return (
        <Layout user={props.user} title="국제바로병원 인트라넷" nav_id="" crumbs={[]}>
            <main className="dashboard">
                <div className="grid grid-cols-3 gap-5">
                    <div aria-label="인트라넷 게시판" className="card-box mb-10 col-span-2">
                        <div className="card-header">
                            <div className="title">인트라넷 게시판</div>
                            <div className="flex-shrink-0">
                                <button className="view-all"></button>
                            </div>
                        </div>
                        <div className="card-body">
                            <nav className="card-tabs">
                                <button
                                    onClick={() => {
                                        goIntranetPosts(11);
                                    }}
                                    className={cls('card-tabs-items', params?.instranet_tab == 11 ? 'active' : '')}
                                >
                                    공지사항
                                </button>
                                <button
                                    onClick={() => {
                                        goIntranetPosts(12);
                                    }}
                                    className={cls('card-tabs-items', params?.instranet_tab == 12 ? 'active' : '')}
                                >
                                    환자안전사고 게시판
                                </button>
                                <button
                                    onClick={() => {
                                        goIntranetPosts(13);
                                    }}
                                    className={cls('card-tabs-items', params?.instranet_tab == 13 ? 'active' : '')}
                                >
                                    감염관리
                                </button>
                                <button
                                    onClick={() => {
                                        goIntranetPosts(14);
                                    }}
                                    className={cls('card-tabs-items', params?.instranet_tab == 14 ? 'active' : '')}
                                >
                                    서식자료실
                                </button>
                                <button
                                    onClick={() => {
                                        goIntranetPosts(15);
                                    }}
                                    className={cls('card-tabs-items', params?.instranet_tab == 15 ? 'active' : '')}
                                >
                                    자유게시판
                                </button>
                                <button
                                    onClick={() => {
                                        goIntranetPosts(16);
                                    }}
                                    className={cls('card-tabs-items', params?.instranet_tab == 16 ? 'active' : '')}
                                >
                                    중고거래게시판
                                </button>
                            </nav>
                            <div className="overflow-x-auto rounded-lg">
                                <table className="dashboard-table divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="">
                                                제목
                                            </th>
                                            <th scope="col" className="">
                                                등록일
                                            </th>
                                            <th scope="col" className="">
                                                등록자
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {intranetPosts?.map((v: any, i: number) => (
                                            <tr key={i}>
                                                <td
                                                    className="cursor-pointer"
                                                    onClick={() => {
                                                        viewPosts(v);
                                                    }}
                                                >
                                                    {v.title}
                                                </td>
                                                <td className="date">{v.create_at}</td>
                                                <td className="">{v.create_name}</td>
                                            </tr>
                                        ))}
                                        <tr className="!bg-white !p-3">
                                            <td colSpan={3}>
                                                <button onClick={goIntranetBoard} className="w-full hover:bg-slate-100 p-3">
                                                    <i className="fas fa-chevron-down me-2"></i> 더보기
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* end card-body */}
                    </div>
                    <div aria-label="사진갤러리" className="card-box mb-10 col-span-1">
                        <div className="card-header">
                            <div className="title">사진갤러리</div>
                            <div className="flex-shrink-0">
                                <button
                                    onClick={() => {
                                        goIntranetBoard('/intranet/gallery');
                                    }}
                                    className="view-all"
                                >
                                    View all
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <Swiper
                                modules={[Pagination, Autoplay]}
                                autoplay={{
                                    delay: 2000,
                                    disableOnInteraction: false,
                                }}
                                speed={1000}
                                slidesPerView={1}
                                // pagination={pagination}
                                spaceBetween={20}
                            >
                                {intranetGallery?.map((v: any, i: number) => (
                                    <SwiperSlide key={i}>
                                        <div
                                            className="cursor-pointer overflow-hidden rounded-lg h-64"
                                            onClick={() => {
                                                viewPosts(v);
                                            }}
                                        >
                                            <img src={`${process.env.NODE_ENV == 'development' ? 'https://smartbaro.com' : ''}${v.thumb}`} alt="" />
                                        </div>
                                        <div className="font-bold mt-5">{v.title}</div>
                                        <div className="date">{v.create_at}</div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* end card-body */}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div aria-label="진료예약 내역" className={cls('card-box mb-10 col-span-1', reserveList.length == 0 ? 'hidden' : '')}>
                        <div className="card-header">
                            <div className="title">진료예약 내역</div>
                            <div className="flex-shrink-0">
                                <button
                                    onClick={() => {
                                        goIntranetBoard('/reserve/list');
                                    }}
                                    className="view-all"
                                >
                                    View all
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="overflow-x-auto rounded-lg">
                                <table className="dashboard-table divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="">
                                                상태
                                            </th>
                                            <th scope="col" className="">
                                                등록자
                                            </th>
                                            <th scope="col" className="">
                                                예약일
                                            </th>
                                            <th scope="col" className="">
                                                등록일
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {reserveList?.map((v: any, i: number) => (
                                            <tr key={i}>
                                                <td>{v.state}</td>
                                                <td className="">{v.user_name}</td>
                                                <td className="date">{v.rev_date}</td>
                                                <td className="date">{v.create_at}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* end card-body */}
                    </div>
                    <div aria-label="전문의 상담" className={cls('card-box mb-10 col-span-1', consultList.length == 0 ? 'hidden' : '')}>
                        <div className="card-header">
                            <div className="title">전문의 상담</div>
                            <div className="flex-shrink-0">
                                <button
                                    onClick={() => {
                                        goIntranetBoard('/qna/consult');
                                    }}
                                    className="view-all"
                                >
                                    View all
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="overflow-x-auto rounded-lg">
                                <table className="dashboard-table divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="">
                                                제목
                                            </th>
                                            <th scope="col" className="">
                                                등록일
                                            </th>
                                            <th scope="col" className="">
                                                등록자
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {consultList?.map((v: any, i: number) => (
                                            <tr key={i}>
                                                <td
                                                    className="cursor-pointer"
                                                    onClick={() => {
                                                        viewPosts(v);
                                                    }}
                                                >
                                                    {v.title}
                                                </td>
                                                <td className="date">{v.create_at}</td>
                                                <td className="">{v.create_name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* end card-body */}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                    <div aria-label="고객의 소리" className={cls('card-box mb-10 col-span-1', vocList.length == 0 ? 'hidden' : '')}>
                        <div className="card-header">
                            <div className="title">고객의 소리</div>
                            <div className="flex-shrink-0">
                                <button
                                    onClick={() => {
                                        goIntranetBoard('/qna/voc');
                                    }}
                                    className="view-all"
                                >
                                    View all
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="overflow-x-auto rounded-lg">
                                <table className="dashboard-table divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="">
                                                제목
                                            </th>
                                            <th scope="col" className="">
                                                등록일
                                            </th>
                                            <th scope="col" className="">
                                                등록자
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {vocList?.map((v: any, i: number) => (
                                            <tr key={i}>
                                                <td
                                                    className="cursor-pointer"
                                                    onClick={() => {
                                                        viewPosts(v);
                                                    }}
                                                >
                                                    {v.title}
                                                </td>
                                                <td className="date">{v.create_at}</td>
                                                <td className="">{v.create_name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* end card-body */}
                    </div>
                    <div aria-label="로그인 이력" className="card-box mb-10 col-span-1">
                        <div className="card-header">
                            <div className="title">{loginUser.user_name} 로그인 이력</div>
                            <div className="flex-shrink-0">
                                <button className="view-all">{loginUser.user_id}</button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="overflow-x-auto rounded-lg">
                                <table className="dashboard-table divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="">
                                                아이피
                                            </th>
                                            <th scope="col" className="">
                                                등록일
                                            </th>
                                            <th scope="col" className="">
                                                로그인 성공여부
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {sessionHisyory?.map((v: any, i: number) => (
                                            <tr key={i}>
                                                <td>{v.ip}</td>
                                                <td className="date">{v.create_at}</td>
                                                <td>{v.is_fail}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* end card-body */}
                    </div>
                </div>
            </main>
        </Layout>
    );
};

export default Home;
