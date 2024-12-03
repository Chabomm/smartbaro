import React, { useState, useEffect } from 'react';
import { api } from '@/libs/axios';
import { cls } from '@/libs/utils';
import { useRouter } from 'next/router';
import useForm from '@/components/form/useForm';
import ListPagenation from '@/components/bbs/ListPagenation';

function BoardPostList({ board_uid, device, no_cache }: any) {
    const router = useRouter();
    const [filter, setFilter] = useState<any>({});
    const [params, setParams] = useState<any>({});
    const [posts, setPosts] = useState<any>([]);
    const [board, setBoard] = useState<any>({});

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if ((!no_cache && sessionStorage.getItem(router.asPath)) || '{}' !== '{}') {
                const reData = JSON.parse(sessionStorage.getItem(router.asPath) || '{}').data;
                setFilter(reData.filter);
                setParams(reData.params);
                setPosts(reData.posts);
                setBoard(reData.board);
                const scroll = parseInt(JSON.parse(sessionStorage.getItem(router.asPath) || '{}').scroll_y, 10);
                let intervalRef = setInterval(() => {
                    window.scrollTo(0, scroll);
                    sessionStorage.removeItem(router.asPath);
                    clearInterval(intervalRef);
                }, 200);
            } else {
                getPostsInit({ uid: board_uid });
            }
        }
    }, [router.asPath]);

    const getPostsInit = async p => {
        try {
            const { data } = await api.post(`/be/front/posts/init`, p);
            if (data.code == 200) {
                setBoard(data.board);
                setFilter(data.filter);
                setParams(data.params);
                getPagePost(data.params);
            } else {
                alert(data.msg);
                router.back();
            }
        } catch (e: any) {}
    };

    const getPagePost = async p => {
        let newPosts = await getPostsData(p);
        setPosts(newPosts.list);
    };

    const getPostsData = async p => {
        try {
            const { data } = await api.post(`/be/front/posts/list`, p);
            setParams(data.params);
            return data;
        } catch (e: any) {}
    };

    const { s, fn, attrs } = useForm({
        initialValues: {
            skeyword_type: '',
            skeyword: '',
        },
        onSubmit: async () => {
            await searching();
        },
    });

    const searching = async () => {
        params.filters = s.values;
        let newPosts = await getPostsData(params);
        setPosts(newPosts.list);
    };

    function goDetail(uid: number) {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(
                router.asPath,
                JSON.stringify({
                    data: {
                        filter: filter,
                        params: params,
                        posts: posts,
                        board: board,
                    },
                    scroll_x: `${window.scrollX}`,
                    scroll_y: `${window.scrollY}`,
                })
            );
        }
        router.push(`/medical/4/${uid}`);
    }

    function goReg() {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(
                router.asPath,
                JSON.stringify({
                    data: {
                        filter: filter,
                        params: params,
                        posts: posts,
                        board: board,
                    },
                    scroll_x: `${window.scrollX}`,
                    scroll_y: `${window.scrollY}`,
                })
            );
        }
        router.push(`/medical/4/reg`);
    }

    return (
        <section className="site-width gall-area pb-20">
            {process.env.NODE_ENV == 'development' && (
                <pre className="hidden">
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <div className="font-bold mb-3 text-red-500">params</div>
                            {JSON.stringify(params, null, 4)}
                        </div>
                        <div>
                            <div className="font-bold mb-3 text-red-500">filter</div>
                            {JSON.stringify(filter, null, 4)}
                        </div>
                        <div>
                            <div className="font-bold mb-3 text-red-500">board</div>
                            {JSON.stringify(board, null, 4)}
                        </div>
                        <div>
                            <div className="font-bold mb-3 text-red-500">s.values</div>
                            {JSON.stringify(s.values, null, 4)}
                        </div>
                        <div className="hidden">
                            <div className="font-bold mb-3 text-red-500">posts</div>
                            {JSON.stringify(posts, null, 4)}
                        </div>
                    </div>
                </pre>
            )}
            <form onSubmit={fn.handleSubmit} noValidate className="form-search grid-cols-1 lg:grid-cols-2">
                <div className=""></div>
                <div className="text-end">
                    <select
                        name="skeyword_type"
                        value={s.values?.skeyword_type || 'all'}
                        onChange={fn.handleChange}
                        className={cls(s.errors['skeyword_type'] ? 'border-danger' : '', 'form-select search-select')}
                        style={{ width: 'auto' }}
                    >
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
                        placeholder="검색어를 입력해주세요"
                        onChange={fn.handleChange}
                        className={cls(s.errors['skeyword'] ? 'border-danger' : '', 'form-control search-input')}
                        style={{ width: 'auto' }}
                    />
                    <button className="search-btn" disabled={s.submitting}>
                        검색
                    </button>
                </div>
            </form>

            <div className="grid-cols-2 table-top-wrap">
                <div className="text-left">
                    총 {params.page_total} 개 중 {params.page_size}개
                </div>
                <div className="text-right">
                    <button className="board-btn" onClick={goReg}>
                        상담하기
                    </button>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
                    <table className="board-table-wrap">
                        <thead className="border-t-2 border-t-slate-500 bg-section-gray">
                            <tr>
                                <th scope="col" className="board-table-th lg:w-24 w-12">
                                    번호
                                </th>
                                <th scope="col" style={{ width: 'auto' }} className="board-table-th">
                                    제목
                                </th>
                                <th scope="col" className="board-table-th lg:w-28 w-14">
                                    작성자
                                </th>
                                <th scope="col" className="board-table-th lg:w-28 w-16">
                                    작성일자
                                </th>
                                <th scope="col" className="board-table-th lg:w-28 w-16">
                                    답변상태
                                </th>
                            </tr>
                        </thead>
                        <tbody className="border-y-2 border-y-stone-200">
                            {posts?.map((v: any, i) => (
                                <tr key={i} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                                    <td className="board-table-td whitespace-nowrap">{v.no}</td>
                                    <td className="board-subject board-table-td">
                                        <div
                                            className="cursor-pointer font-semibold"
                                            onClick={e => {
                                                goDetail(v.uid);
                                            }}
                                        >
                                            {v.title}
                                        </div>
                                    </td>
                                    <td className="board-table-td">{v.create_name}</td>
                                    <td className="board-table-td">{v.create_at}</td>
                                    <td className="board-table-td">{v.state}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="my-5 text-right">
                <button className="board-btn" onClick={goReg}>
                    상담하기
                </button>
            </div>

            <ListPagenation props={params} getPagePost={getPagePost} device={device} />
        </section>
    );
}

export default BoardPostList;
