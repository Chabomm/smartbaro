import type { GetServerSideProps, NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api, setContext } from '@/libs/axios';
import LayoutPopupClean from '@/components/LayoutPopupClean';
import BoardReply from '@/components/bbs/BoardReply';

const BoardPostView: NextPage = (props: any) => {
    const router = useRouter();
    const [posts, setPosts] = useState<any>({});

    useEffect(() => {
        if (props) {
            setPosts(props.response);
        }
    }, [router.asPath]);

    const download_file = async file => {
        try {
            const { data } = await api({
                url: `/be/admin/posts/file/download/${file.uid}`,
                method: 'POST',
                responseType: 'blob',
            });
            var fileURL = window.URL.createObjectURL(new Blob([data]));
            var fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', file.fake_name);
            document.body.appendChild(fileLink);
            fileLink.click();
        } catch (e: any) {}
    };

    const routePosts = (uid: number) => {
        if (uid > 0) {
            router.replace(`/board/posts/view?uid=${uid}`);
        }
    };

    const goEdit = (uid: number) => {
        window.open(`/board/posts/edit?uid=${uid}`, '게시물 등록/수정', 'width=1120,height=800,location=no,status=no,scrollbars=yes');
    };

    return (
        <LayoutPopupClean title={'게시물상세'}>
            <div className="card_area mb-20">
                <section className="site-width pb-24 bbs-contents">
                    <div className="my-10 text-center">
                        <div className="text-2xl font-bold mb-2">{posts.title}</div>
                        <div className="text-base font-normal text-gray-500">{posts.create_at}</div>
                    </div>

                    <div className="border-y-2 border-second mb-10">
                        {posts?.files?.length > 0 && posts.files[0].uid > 0 && (
                            <table className="form-table table table-bordered align-middle w-full">
                                <tbody className="border-t border-black">
                                    <tr>
                                        <th scope="row">
                                            <span className="">첨부파일</span>
                                        </th>
                                        <td colSpan={3} className="!px-5 !pt-3 !pb-0">
                                            <div className="">
                                                {posts?.files?.map((v, i) => (
                                                    <div
                                                        key={i}
                                                        className="mb-3 cursor-pointer"
                                                        onClick={e => {
                                                            download_file(v);
                                                        }}
                                                    >
                                                        <i className="far fa-save me-2"></i>
                                                        <span className="">{v.fake_name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}

                        {posts.person && (
                            <table className="form-table table table-bordered align-middle w-full">
                                <tbody className="border-t border-black">
                                    <tr>
                                        <th scope="row">
                                            <span className="">개인정보</span>
                                        </th>
                                        <td colSpan={3} className="!px-5 !pt-3 !pb-0">
                                            <div className="flex items-center mb-3">
                                                <div className="shrink-0 w-20 font-bold text-end">이 름</div>
                                                <div className="flex-grow ps-5">{posts?.person?.name}</div>
                                            </div>
                                            <div className="flex items-center mb-3">
                                                <div className="shrink-0 w-20 font-bold text-end">휴대전화</div>
                                                <div className="flex-grow ps-5">{posts?.person?.mobile}</div>
                                            </div>
                                            <div className="flex items-center mb-3">
                                                <div className="shrink-0 w-20 font-bold text-end">이메일</div>
                                                <div className="flex-grow ps-5">{posts?.person?.email}</div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}

                        <div className="border-t border-black py-10 text-justify px-10 bg-white">
                            {posts.youtube && (
                                <div className="embed-container">
                                    <iframe src={`https://www.youtube.com/embed/${posts.youtube}`} frameBorder="0" allowFullScreen></iframe>
                                </div>
                            )}
                            <div className="ck-content" dangerouslySetInnerHTML={{ __html: posts.contents }}></div>
                        </div>

                        <div className="border-t border-black bg-white">
                            <div className="flex justify-between py-2 px-10 border-b">
                                <div>
                                    <i className="fas fa-chevron-up me-2"></i>이전글
                                </div>
                                <div className="flex-grow px-10">
                                    <div
                                        onClick={e => {
                                            routePosts(posts?.prev_posts?.uid);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        {posts?.prev_posts?.title}
                                    </div>
                                </div>
                                <div className="text-gray-500">{posts?.prev_posts?.create_at}</div>
                            </div>
                            <div className="flex justify-between py-2 px-10">
                                <div>
                                    <i className="fas fa-chevron-down me-2"></i>다음글
                                </div>
                                <div className="flex-grow px-10">
                                    <div
                                        onClick={e => {
                                            routePosts(posts?.next_posts?.uid);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        {posts?.next_posts?.title}
                                    </div>
                                </div>
                                <div className="text-gray-500">{posts?.next_posts?.create_at}</div>
                            </div>
                        </div>
                    </div>

                    {posts?.board?.per_write && (
                        <div className="text-center mb-10">
                            <button
                                type="button"
                                className="btn-newadd"
                                onClick={() => {
                                    goEdit(posts.uid);
                                }}
                            >
                                <i className="fas fa-pen me-2"></i> 게시물 수정하기
                            </button>
                        </div>
                    )}
                    {posts?.board?.is_comment == 'T' && <BoardReply props={props} />}
                </section>
            </div>
        </LayoutPopupClean>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    setContext(ctx);
    var request = {
        uid: ctx.query.uid,
    };
    var response: any = {};
    try {
        const { data } = await api.post(`/be/admin/posts/read`, request);
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

export default BoardPostView;
