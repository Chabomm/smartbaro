import type { GetServerSideProps, NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Breadcrumb from '@/components/Breadcrumb';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import Seo from '@/components/Seo';
import useForm from '@/components/form/useForm';
import { cls, getAgentDevice, staticReplace } from '@/libs/utils';
import { api, setContext } from '@/libs/axios';

const BbsVoc: NextPage = (props: any) => {
    const router = useRouter();
    const nav_id = '/bbs/voc';
    const nav_name = '고객의 소리';
    const page_header = { nav_id: nav_id, sub_title: nav_name };

    const init_data = props.response;

    const [posts, setPosts] = useState<any>([]);

    useEffect(() => {
        if (JSON.stringify(props) !== '{}') {
            setPosts(props.response);
            s.setValues(props.response.values);
        }
    }, [props]);

    const { s, fn, attrs } = useForm({
        onSubmit: async () => {
            await editing('REG');
        },
    });

    const editing = async mode => {
        try {
            const params = { ...s.values };

            if (!params.is_agree || params.is_agree == null) {
                alert('개인정보 수집, 이용에 동의해주세요');
                const el = document.querySelector("input[name='is_agree']");
                (el as HTMLElement)?.focus();
                return;
            }

            const { data } = await api.post(`/be/front/posts/create`, params);
            if (data.code == 200) {
                alert(data.msg);
                s.setValues(init_data);
            } else {
                alert(data.msg);
                return;
            }
        } catch (e: any) {}
    };

    function goBack() {
        router.back();
    }

    return (
        <Layout title={nav_name} nav_id={nav_id} device={props.device}>
            <Seo title={nav_name} />
            <PageHeader params={page_header} device={props.device} />
            <Breadcrumb nav_id={nav_id} device={props.device} />

            <div className="subject sub-py">고객의 소리</div>
            <form onSubmit={fn.handleSubmit} noValidate>
                <section className="site-width reserve-wrap">
                    <div className="site-width reserve-item">
                        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-5 normal-text">
                            <div className="pb-7">
                                <label className="form-label">이름</label>
                                <input
                                    type="text"
                                    name="name"
                                    {...attrs.is_mand}
                                    value={s.values?.name || ''}
                                    placeholder="이름을 입력해주세요."
                                    onChange={fn.handleChange}
                                    className={cls(s.errors['name'] ? 'border-danger' : '', 'form-control')}
                                />
                                {s.errors['name'] && <div className="form-error">{s.errors['name']}</div>}
                            </div>
                            <div className="pb-7">
                                <label className="form-label">휴대폰 번호</label>
                                <input
                                    type="text"
                                    name="mobile"
                                    {...attrs.is_mobile}
                                    value={s.values?.mobile || ''}
                                    placeholder="숫자만 입력해주세요."
                                    onChange={fn.handleChange}
                                    className={cls(s.errors['mobile'] ? 'border-danger' : '', 'form-control')}
                                />
                                {s.errors['mobile'] && <div className="form-error">{s.errors['mobile']}</div>}
                            </div>
                            <div className="pb-7">
                                <label className="form-label">이메일</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={s.values?.email || ''}
                                    placeholder="이메일을 입력해주세요."
                                    onChange={fn.handleChange}
                                    className={cls(s.errors['email'] ? 'border-danger' : '', 'form-control')}
                                />
                            </div>
                        </div>

                        <div className="pb-7">
                            <label className="form-label">제목</label>
                            <input
                                type="text"
                                name="title"
                                {...attrs.is_mand}
                                {...attrs.is_title}
                                value={s.values?.title || ''}
                                placeholder="제목을 입력해주세요."
                                onChange={fn.handleChange}
                                className={cls(s.errors['title'] ? 'border-danger' : '', 'form-control')}
                            />
                            {s.errors['title'] && <div className="form-error">{s.errors['title']}</div>}
                        </div>
                        <div className="">
                            <label className="form-label">문의내용</label>
                            <textarea
                                name="contents"
                                rows={5}
                                maxLength={70}
                                {...attrs.is_mand}
                                value={s.values?.contents || ''}
                                placeholder="문의 내용을 입력해주세요."
                                onChange={fn.handleTextAreaChange}
                                className={cls(s.errors['contents'] ? 'border-danger' : '', 'form-control')}
                            />
                            {s.errors['contents'] && <div className="form-error">{s.errors['contents']}</div>}
                        </div>
                    </div>
                </section>
                <section className="site-width reserve-wrap">
                    <div className="site-width reserve-item">
                        <div className="subject2 font-bold !pt-0">
                            개인정보 수집, 이용 동의 <span className="text-point">(필수)</span>
                        </div>
                        <div className="agree-box">
                            <div className="text-justify" dangerouslySetInnerHTML={{ __html: props.response.res_agreement }}></div>
                        </div>
                        <div className="txt-md">
                            <input
                                className={cls(s.errors['is_terms'] ? 'border-danger' : '', 'mr-2')}
                                onChange={fn.handleChange}
                                name="is_agree"
                                id="is_agree"
                                {...attrs.is_mand}
                                {...attrs.is_single_check}
                                checked={s.values?.is_agree || ''}
                                type="checkbox"
                            />
                            <label className="font-medium" htmlFor="is_agree">
                                개인정보 수집 이용에 동의합니다.
                            </label>
                            {s.errors?.is_agree && <p className="text-red-500 text-xs italic">{s.errors?.is_agree}</p>}
                        </div>
                    </div>
                </section>
                <section className="site-width sub-py">
                    <div className="">
                        <div className="button-group grid-cols-2">
                            <button className="reserve-btn bg-second text-white" disabled={s.submitting}>
                                작성완료
                            </button>
                            <div
                                onClick={() => {
                                    goBack();
                                }}
                                className="reserve-btn"
                                style={{ backgroundColor: '#e5e5e5' }}
                            >
                                목록으로
                            </div>
                        </div>
                    </div>
                </section>
            </form>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    setContext(ctx);
    const device = getAgentDevice(ctx);

    var request: any = {
        posts_uid: 0,
        password: '',
        values_type: 'voc',
    };

    var response: any = {};
    try {
        const { data } = await api.post(`/be/front/posts/read`, request);
        response = data;
        const res_agreement = await api.get(`/resource/html/terms/agreement.html`);
        response.res_agreement = staticReplace(res_agreement.data, ctx);
    } catch (e: any) {
        if (typeof e.redirect !== 'undefined') {
            return { redirect: e.redirect };
        }
    }
    return {
        props: { request, response, device: device },
    };
};

export default BbsVoc;
