import Breadcrumb from '@/components/Breadcrumb';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import Seo from '@/components/Seo';
import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { getAgentDevice } from '@/libs/utils';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { api, setContext } from '@/libs/axios';

export default function Medical_4_view(props: any) {
    const router = useRouter();
    const nav_id = '/medical/4';
    const nav_name = '전문의 상담';
    const page_header = { nav_id: nav_id, sub_title: nav_name };

    const [posts, setPosts] = useState(props?.response);
    const [secretVaild, setSecretVaild] = useState(false);

    useEffect(() => {
        if (typeof props.response.code === 'undefined' || props.response.code == '') {
            setSecretVaild(false);
        } else if (props.response.msg != '') {
            alert(props.response.msg);
            setSecretVaild(false);
        } else if (props.response.code == 200) {
            if (props.response.uid > 0) {
                setSecretVaild(true);
            }
        }
    }, [props]);

    function goBack() {
        router.back();
    }

    return (
        <Layout title={nav_name} nav_id={nav_id} device={props.device}>
            <Seo title={nav_name} />
            <PageHeader params={page_header} device={props.device} />
            <Breadcrumb nav_id={nav_id} device={props.device} />

            <div className="subject sub-py">전문의 상담</div>

            {secretVaild ? (
                <div>
                    <section className="site-width reserve-wrap">
                        <div className="site-width reserve-item">
                            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-5 normal-text">
                                <div className="pb-7">
                                    <label className="form-label">이름</label>
                                    <div className="form-control">{posts?.person?.name}ㅤ</div>
                                </div>
                                <div className="pb-7">
                                    <label className="form-label">휴대폰 번호</label>
                                    <div className="form-control">{posts?.person?.mobile}ㅤ</div>
                                </div>
                                <div className="pb-7">
                                    <label className="form-label">이메일</label>
                                    <div className="form-control">{posts?.person?.email}ㅤ</div>
                                </div>
                            </div>
                            <div className="pb-7">
                                <label className="form-label">제목</label>
                                <div className="form-control">{posts.title}</div>
                            </div>
                            <div className="pb-7">
                                <label className="form-label">문의내용</label>
                                <textarea readOnly className="form-control h-64">
                                    {posts.contents}
                                </textarea>
                            </div>
                            <div className="pb-7">
                                <label className="form-label">답변내용</label>
                                <div className="border p-5">
                                    {posts.replys.length == 0 ? (
                                        <div className="text-lg">등록된 답변이 없습니다.</div>
                                    ) : (
                                        <div>
                                            {posts.replys?.map((v, i) =>
                                                i == 0 ? (
                                                    <div key={i} className="grid gird-cols-1 lg:grid-cols-12 lg:gap-5">
                                                        <div className="lg:col-span-9 whitespace-pre-wrap">{v.reply}</div>
                                                        <div className="mt-5 col-span-3 self-end text-end text-gray-600">{v.create_at}</div>
                                                    </div>
                                                ) : (
                                                    <div key={i} className="grid gird-cols-1 lg:grid-cols-12 lg:gap-5 mt-5 pt-5 border-t">
                                                        <div className="lg:col-span-9 whitespace-pre-wrap">{v.reply}</div>
                                                        <div className="mt-5 col-span-3 self-end text-end text-gray-600">{v.create_at}</div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="site-width padding-y">
                        <div className="contents-width text-center">
                            <Link href={'/medical/4'}>
                                <button className="bg-second text-white text-lg font-semibold w-48 py-2.5 ">목록보기</button>
                            </Link>
                        </div>
                    </section>
                </div>
            ) : (
                <form method="POST">
                    <div className="site-width">
                        <div>비밀번호를 입력해주세요 :</div>
                        <input type="password" name="password" className="form-control" />

                        <section className="padding-y">
                            <div className="">
                                <div className="button-group grid-cols-2 ">
                                    <div
                                        onClick={() => {
                                            goBack();
                                        }}
                                        className="reserve-btn"
                                        style={{ backgroundColor: '#e5e5e5' }}
                                    >
                                        취소
                                    </div>
                                    <button type="submit" className="reserve-btn  bg-second text-white">
                                        확인
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                </form>
            )}
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
    let postData: any = { password: '' };
    if (ctx.req?.method == 'POST') {
        postData = await new Promise((resolve, reject) => {
            // post data getting ...
            const body: any = [];
            ctx.req?.on('data', (chunk: any) => {
                body.push(chunk);
            });
            ctx.req?.on('end', () => {
                const asString = body.toString();
                const data = JSON.parse('{"' + decodeURI(asString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
                resolve(data);
            });
            ctx.req?.on('error', e => {
                resolve(e);
            });
        });
    }

    setContext(ctx);
    const device = getAgentDevice(ctx);
    var request: any = {
        posts_uid: ctx.query.uid,
        password: postData?.password,
    };
    var response: any = {};

    if (typeof postData.password === 'undefined' || postData.password == '') {
        return {
            // props: { request, response, device: device },
            props: { response, device: device }, // request에 비밀번호가 있어서 제외함
        };
    }

    try {
        const { data } = await api.post(`/be/front/posts/read`, request);
        response = data;
    } catch (e: any) {
        if (typeof e.redirect !== 'undefined') {
            return { redirect: e.redirect };
        }
    }
    return {
        props: { request, response, device: device },
    };
};
