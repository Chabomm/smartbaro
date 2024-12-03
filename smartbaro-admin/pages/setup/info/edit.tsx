import type { GetServerSideProps, NextPage } from 'next';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import Layout from '@/components/Layout';
import useForm from '@/components/form/useForm';
import { api, setContext } from '@/libs/axios';
import { cls } from '@/libs/utils';
import ButtonSubmit from '@/components/UIcomponent/ButtonSearch';

const InfoEdit: NextPage = (props: any) => {
    const router = useRouter();

    useEffect(() => {
        if (JSON.stringify(props) !== '{}') {
            s.setValues(props.response);
        }
    }, [props]);

    const { s, fn, attrs } = useForm({
        initialValues: {},
        onSubmit: async () => {
            await editing();
        },
    });

    const editing = async () => {
        try {
            const params = { ...s.values };

            const regex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,20}$/;
            if (params.user_pw !== '') {
                if (!regex.test(params.user_pw)) {
                    alert('비밀번호는 영문, 숫자 조합 6자 이상, 20자 이하여야 합니다.');
                    return;
                }
            }

            const res = await api.post(`/be/admin/setup/info/update`, params);
            const result = res.data;
            if (result.code == 200) {
                alert(result.msg);
                router.replace(`/setup/info/edit`);
            } else {
                alert(result.msg);
            }
        } catch (e: any) {}
    };

    return (
        <Layout user={props.user} title="국제바로병원 인트라넷" nav_id={37} crumbs={['환경설정', '정보수정']}>
            <div className="border-t h-10"></div>

            <form onSubmit={fn.handleSubmit} noValidate>
                <div className="border py-4 px-6 rounded shadow-md bg-white">
                    <div className="card_area">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <label className="form-label">관리자 ID</label>
                                <input type="text" name="user_id" value={s.values?.user_id || ''} placeholder="" onChange={fn.handleChange} className="form-control" disabled />
                            </div>
                            <div className="col-span-1">
                                <label className="form-label">비밀번호</label>
                                <input
                                    type="password"
                                    name="user_pw"
                                    autoComplete="new-password"
                                    {...(s.values?.uid == 0 && { ...attrs.is_mand })}
                                    placeholder={s.values?.uid > 0 ? '비밀번호 변경할때만 입력해주세요' : ''}
                                    value={s.values?.user_pw || ''}
                                    onChange={fn.handleChange}
                                    className={cls(s.errors['user_pw'] ? 'border-danger' : '', 'form-control')}
                                />
                                {s.errors['user_pw'] && <div className="form-error">{s.errors['user_pw']}</div>}
                            </div>
                            <div className="col-span-1">
                                <label className="form-label">이름</label>
                                <input
                                    type="text"
                                    name="user_name"
                                    value={s.values?.user_name || ''}
                                    maxLength={50}
                                    placeholder=""
                                    onChange={fn.handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="form-label">부서</label>
                                <input
                                    type="text"
                                    name="depart"
                                    {...attrs.is_mand}
                                    value={s.values?.depart || ''}
                                    placeholder=""
                                    onChange={fn.handleChange}
                                    className={cls(s.errors['depart'] ? 'border-danger' : '', 'form-control')}
                                />
                                {s.errors['depart'] && <div className="form-error">{s.errors['depart']}</div>}
                            </div>
                            <div className="col-span-1">
                                <label className="form-label">이메일</label>
                                <input
                                    type="text"
                                    name="email"
                                    {...attrs.is_mand}
                                    {...attrs.is_email}
                                    value={s.values?.email || ''}
                                    placeholder=""
                                    onChange={fn.handleChange}
                                    className={cls(s.errors['email'] ? 'border-danger' : '', 'form-control')}
                                />
                                {s.errors['email'] && <div className="form-error">{s.errors['email']}</div>}
                            </div>
                            <div className="col-span-1">
                                <label className="form-label">내선번호</label>
                                <input type="text" name="tel" value={s.values?.tel || ''} placeholder="" onChange={fn.handleChange} className="form-control" />
                            </div>
                            <div className="col-span-1">
                                <label className="form-label">핸드폰번호</label>
                                <input
                                    type="text"
                                    name="mobile"
                                    {...attrs.is_mand}
                                    {...attrs.is_mobile}
                                    value={s.values?.mobile || ''}
                                    placeholder=""
                                    onChange={fn.handleChange}
                                    className={cls(s.errors['mobile'] ? 'border-danger' : '', 'form-control')}
                                />
                                {s.errors['mobile'] && <div className="form-error">{s.errors['mobile']}</div>}
                            </div>
                        </div>
                        {/* end grid */}
                    </div>
                    {/* card_area */}
                    <div className="mt-7 w-full text-center">
                        <ButtonSubmit submitting={s.submitting}>
                            <i className="fas fa-edit me-2"></i>
                            수정하기
                        </ButtonSubmit>
                    </div>
                </div>
            </form>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    setContext(ctx);
    var request: any = {};
    var response: any = {};
    try {
        const { data } = await api.post(`/be/admin/setup/info/read`, request);
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

export default InfoEdit;
