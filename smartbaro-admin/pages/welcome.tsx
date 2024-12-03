import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { GetServerSideProps, NextPage, NextPageContext } from 'next';

import LayoutPopup from '@/components/LayoutPopup';
import useForm from '@/components/form/useForm';
import { api, setContext } from '@/libs/axios';
import { cls } from '@/libs/utils';
import ButtonEditing from '@/components/UIcomponent/ButtonEditing';

const Welcome: NextPage = (props: any) => {
    const router = useRouter();

    const [posts, setPosts] = useState<any>({});

    useEffect(() => {
        if (JSON.stringify(props) !== '{}') {
            setPosts(props.response);
        }
    }, [props]);

    const { s, fn, attrs } = useForm({
        initialValues: {
            user_pw: null,
            user_pw2: null,
        },
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

            // 임시 비번 새 비번 같으면
            if (params.user_pw != params.user_pw2) {
                alert('새 비밀번호와 새 비밀번호 확인 값이 일치하지 않습니다.');
                return;
            }

            const res = await api.post(`/be/admin/setup/info/update`, params);
            const result = res.data;

            if (result.code == 200) {
                alert(result.msg);
                router.replace(`/`);
            } else {
                alert(result.msg);
            }
        } catch (e: any) {}
    };

    return (
        <div className="edit_popup w-full bg-slate-100 mx-auto py-10 px-9" style={{ minHeight: '100vh' }}>
            <form onSubmit={fn.handleSubmit} noValidate>
                <div className="card_area w-1/2 mx-auto">
                    <div className="">
                        <div className="text-xl font-bold text-center mb-5">비밀번호 재설정</div>
                        <div className="text-slate-500 text-sm mb-5">
                            <div>비밀번호를 재설정 후 이용 가능합니다.</div>
                            <div>
                                기타 정보는 홈 {'>'} 환경설정 {'>'} 정보수정 에서 수정가능합니다.
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <label className="form-label">새 비밀번호</label>
                            <input
                                type="password"
                                name="user_pw"
                                autoComplete="new-password"
                                {...attrs.is_mand}
                                placeholder="새 비밀번호를 입력해주세요"
                                value={s.values?.user_pw || ''}
                                onChange={fn.handleChange}
                                className={cls(s.errors['user_pw'] ? 'border-danger' : '', 'form-control')}
                            />
                            {s.errors['user_pw'] && <div className="form-error">{s.errors['user_pw']}</div>}
                        </div>
                        <div className="col-span-1">
                            <label className="form-label">새 비밀번호 확인</label>
                            <input
                                type="password"
                                name="user_pw2"
                                autoComplete="new-password"
                                {...attrs.is_mand}
                                placeholder="새 비밀번호를 다시 입력해주세요"
                                value={s.values?.user_pw2 || ''}
                                onChange={fn.handleChange}
                                className={cls(s.errors['user_pw2'] ? 'border-danger' : '', 'form-control')}
                            />
                            {s.errors['user_pw2'] && <div className="form-error">{s.errors['user_pw2']}</div>}
                        </div>
                        <div className="col-span-1">
                            <label className="form-label">관리자 ID</label>
                            <input type="text" name="user_id" value={posts.user_id || ''} placeholder="" onChange={fn.handleChange} className="form-control" disabled />
                        </div>
                        <div className="col-span-1">
                            <label className="form-label">이름</label>
                            <div className="form-control">{posts.user_name}</div>
                        </div>
                        <div className="col-span-1">
                            <label className="form-label">부서</label>
                            <div className="form-control">{posts.depart}</div>
                        </div>
                        <div className="col-span-1">
                            <label className="form-label">이메일</label>
                            <div className="form-control">{posts.email}</div>
                        </div>
                        <div className="col-span-1">
                            <label className="form-label">내선번호</label>
                            <div className="form-control">{posts.tel}</div>
                        </div>
                        <div className="col-span-1">
                            <label className="form-label">핸드폰번호</label>
                            <div className="form-control">{posts.mobile}</div>
                        </div>
                    </div>
                    {/* end grid */}
                    <div className="mt-10 text-center w-full">
                        <ButtonEditing submitting={s.submitting}>
                            <i className="fas fa-edit me-2"></i>
                            수정하기
                        </ButtonEditing>
                    </div>
                </div>
                {/* card_area */}
            </form>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    setContext(ctx);
    var request: any = {};
    var response: any = {};
    try {
        const { data } = await api.post(`/be/admin/welcome/read`, request);
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

export default Welcome;
