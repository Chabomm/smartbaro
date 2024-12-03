import React, { useState, useEffect } from 'react';
import { api } from '@/libs/axios';
import { cls, elapsedTime } from '@/libs/utils';
import { useRouter } from 'next/router';

import useForm from '@/components/form/useForm';
import ListPagenation from '@/components/bbs/ListPagenation';

function BoardPostGallery({ board_uid, hidden_date, device }: any) {
    const router = useRouter();
    const [filter, setFilter] = useState<any>({});
    const [params, setParams] = useState<any>({});
    const [posts, setPosts] = useState<any>([]);
    const [board, setBoard] = useState<any>({});

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (sessionStorage.getItem(router.asPath) || '{}' !== '{}') {
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

    const handleImgError = e => {
        e.target.src = '/resource/images/common/no_image.jpg';
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
        router.push(`/bbs/view/${uid}`);
    }

    return (
        <section className="site-width gall-area pb-20">
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

            <div className="gall-wrap grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-6">
                {posts.length == 0 && <div className="empty_posts col-span-2 lg:col-span-3 text-center">등록된 게시물이 없습니다.</div>}

                {posts.map((v: any) => (
                    <div
                        key={v.uid}
                        onClick={e => {
                            goDetail(v.uid);
                        }}
                        className="mb-5"
                    >
                        <div className={cls('overflow-hidden', board.uid == 2 ? '' : 'img-box rounded-lg h-64')}>
                            <img
                                onError={handleImgError}
                                alt="img"
                                className={cls(board.uid == 2 ? '' : 'object-cover object-center h-full w-full transition hover:duration-500 hover:scale-125')}
                                src={v?.thumb ? v.thumb : '/resource/images/common/no_image.jpg'}
                            />
                        </div>
                        <div className="">
                            <h2 className="normal-text !font-medium mt-3 line-hidden-2">{v.title}</h2>
                            <div className={cls(hidden_date ? 'hidden' : 'txt-desc')}>
                                <span className="text-amber-500">{board.board_name}</span>
                                <span className="mx-2">|</span>
                                <span className="">{elapsedTime(v.create_at)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ListPagenation props={params} getPagePost={getPagePost} device={device} />
        </section>
    );
}

export default BoardPostGallery;
