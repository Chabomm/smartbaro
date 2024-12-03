import React, { useState, useEffect } from 'react';
import { api } from '@/libs/axios';
import Datepicker from 'react-tailwindcss-datepicker';
import { cls } from '@/libs/utils';

import useForm from '@/components/form/useForm';
import ListPagenation from '@/components/bbs/ListPagenation';
import ButtonSerach from '@/components/UIcomponent/ButtonSearch';

function IntranetBoardPostList(props: any) {
    const [filter, setFilter] = useState<any>({});
    const [params, setParams] = useState<any>({});
    const [posts, setPosts] = useState<any>([]);
    const [board, setBoard] = useState<any>({});

    useEffect(() => {
        getPostsInit({ uid: props.board_uid });
    }, []);

    const getPostsInit = async p => {
        try {
            const { data } = await api.post(`/be/admin/intranet/posts/init`, p);
            setBoard(data.board);
            setFilter(data.filter);
            setParams(data.params);
            getPagePost(data.params);
        } catch (e: any) {}
    };

    const getPagePost = async p => {
        let newPosts = await getPostsData(p);
        setPosts(newPosts.list);
    };

    const getPostsData = async p => {
        try {
            const { data } = await api.post(`/be/admin/posts/list`, p);
            setParams(data.params);
            return data;
        } catch (e: any) {}
    };

    const { s, fn } = useForm({
        initialValues: {},
        onSubmit: async () => {
            await searching();
        },
    });

    const searching = async () => {
        let board_uid = params.filters.board_uid;
        params.filters = s.values;
        params.filters.board_uid = board_uid;
        let newPosts = await getPostsData(params);
        setPosts(newPosts.list);
    };

    const goEdit = (item: any) => {
        window.open(`/board/posts/edit?uid=${item.uid}&board_uid=${item.board_uid}`, '게시물 등록/수정', 'width=1120,height=800,location=no,status=no,scrollbars=yes');
    };

    const viewPosts = (item: any) => {
        window.open(`/board/posts/view?uid=${item.uid}`, '게시물 상세', 'width=1120,height=800,location=no,status=no,scrollbars=yes');
    };

    const getStateTxt = (state: string) => {
        let state_txt = '';
        if (state == '100') {
            state_txt = '<span class="text-red-500">미답변</span>';
        } else if (state == '200') {
            state_txt = '<span class="text-blue-500">답변완료</span>';
        } else if (state == '300') {
            state_txt = '<span class="">공지</span>';
        }
        return state_txt;
    };

    return (
        <>
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
                    <div className="col-span-3">
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
            </form>

            <div className="col-table-header">
                <div className="text-left">
                    총 {params.page_total} 개 중 {params.page_size}개
                </div>
                <div className="text-right">
                    {board?.poss_insert && (
                        <button
                            type="button"
                            className="btn-newadd"
                            onClick={() => {
                                goEdit({ uid: 0, board_uid: props.board_uid });
                            }}
                        >
                            <i className="fas fa-pen me-2"></i> 게시물 등록하기
                        </button>
                    )}
                </div>
            </div>

            <div className="col-table">
                <div className="col-table-th grid grid-cols-8 sticky top-16 bg-gray-100">
                    <div className="">번호</div>
                    {board.board_type == 'qna' && <div className="">답변상태</div>}
                    <div className={cls(board.board_type == 'qna' ? 'col-span-3' : 'col-span-4')}>게시물 제목</div>
                    <div className="">작성자</div>
                    <div className="">작성일</div>
                    <div className="">상세보기</div>
                </div>

                {posts?.map((v: any, i: number) => (
                    <div key={i} className="col-table-td grid grid-cols-8 bg-white transition duration-300 ease-in-out hover:bg-gray-100 !text-base">
                        <div className="">{v.uid}</div>

                        {board.board_type == 'qna' && <div className="" dangerouslySetInnerHTML={{ __html: getStateTxt(v.state) }}></div>}

                        <div
                            onClick={() => {
                                viewPosts(v);
                            }}
                            className={cls('!justify-start text-left truncate', board.board_type == 'qna' ? 'col-span-3' : 'col-span-4')}
                        >
                            {v.thumb == '' || v.thumb == null ? '' : <i className="far fa-image mr-3 text-blue-400"></i>}
                            <span className="cursor-pointer">
                                <span className="">{v.title}</span>
                                {v.reply_count > 0 && (
                                    <span className="text-green-600 ms-3">
                                        <i className="far fa-comment-dots"></i> {v.reply_count}
                                    </span>
                                )}
                                {v.file_count > 0 && (
                                    <span className="text-blue-600 ms-3">
                                        <i className="fas fa-save"></i> {v.file_count}
                                    </span>
                                )}
                            </span>
                        </div>
                        <div className="">{v.create_name}</div>
                        <div className="">
                            <div dangerouslySetInnerHTML={{ __html: v.create_at }}></div>
                        </div>
                        <div className="">
                            {v.poss_update && (
                                <>
                                    <button
                                        type="button"
                                        className="text-blue-500 underline"
                                        onClick={() => {
                                            goEdit(v);
                                        }}
                                    >
                                        수정
                                    </button>
                                    <span className="mx-2">|</span>
                                </>
                            )}
                            <button
                                type="button"
                                className="text-blue-500 underline"
                                onClick={() => {
                                    viewPosts(v);
                                }}
                            >
                                게시물보기
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <ListPagenation props={params} getPagePost={getPagePost} />
        </>
    );
}

export default IntranetBoardPostList;
