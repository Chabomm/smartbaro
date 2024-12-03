import type { GetServerSideProps, NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api, setContext } from '@/libs/axios';
import { checkNumeric, cls } from '@/libs/utils';

import useForm from '@/components/form/useForm';
import LayoutPopup from '@/components/LayoutPopup';

const SetupManagerEdit: NextPage = (props: any) => {
    const router = useRouter();
    const [filter, setFilter] = useState<any>([]);

    useEffect(() => {
        if (props) {
            s.setValues(props.response.values);
            setFilter(props.response.filter);
        }
    }, [props]);

    const { s, fn, attrs } = useForm({
        initialValues: {},
        onSubmit: async () => {
            await editing('REG');
        },
    });

    const deleting = () => editing('DEL');

    const editing = async mode => {
        try {
            if (mode == 'REG' && s.values.uid > 0) {
                mode = 'MOD';
            }
            s.values.mode = mode;

            if (mode == 'DEL') {
                if (!confirm('삭제시 해당 사용자는 로그인이 불가합니다. 계속하시겠습니까 ?')) {
                    return;
                }
            }

            const { data } = await api.post(`/be/admin/setup/manager/edit`, s.values);
            if (data.code == 200) {
                alert(data.msg);
                router.push('/setup/manager/edit?uid=' + data.uid);
            } else {
                alert(data.msg);
            }
            s.setSubmitting(false);
        } catch (e: any) {}
    };

    return (
        <LayoutPopup title="관리자 상세정보">
            <div className="card_area mb-20">
                <div className="text-2xl font-semibold text-center mb-10">관리자 상세정보</div>
                <form onSubmit={fn.handleSubmit} noValidate className="pb-14">
                    <div className="grid grid-cols-2 gap-4 px-5 pt-5">
                        {s.values.uid > 0 ? (
                            <div className="col-span-1">
                                <label className="form-label">관리자 아이디</label>
                                <input
                                    readOnly
                                    type="text"
                                    name="user_id"
                                    value={s.values?.user_id || ''}
                                    placeholder=""
                                    onChange={fn.handleChange}
                                    className={cls(s.errors['user_id'] ? 'border-danger' : '', 'form-control')}
                                />
                            </div>
                        ) : (
                            <div className="col-span-1">
                                <label className="form-label">관리자 아이디</label>
                                <input
                                    type="text"
                                    name="user_id"
                                    autoComplete="new-password"
                                    {...attrs.is_mand}
                                    value={s.values?.user_id || ''}
                                    placeholder=""
                                    onChange={fn.handleChange}
                                    className={cls(s.errors['user_id'] ? 'border-danger' : '', 'form-control')}
                                />
                                {s.errors['user_id'] && <div className="form-error">{s.errors['user_id']}</div>}
                            </div>
                        )}

                        <div className="col-span-1">
                            <label className="form-label">관리자 비밀번호</label>
                            <input
                                type="password"
                                name="user_pw"
                                autoComplete="new-password"
                                {...(s.values?.uid == 0 && { ...attrs.is_mand })}
                                placeholder={s.values?.uid > 0 && '비밀번호 변경할때만 입력해주세요'}
                                value={s.values?.user_pw || ''}
                                onChange={fn.handleChange}
                                className={cls(s.errors['user_pw'] ? 'border-danger' : '', 'form-control')}
                            />
                            {s.errors['user_pw'] && <div className="form-error">{s.errors['user_pw']}</div>}
                        </div>

                        <div className="col-span-1">
                            <label className="form-label">관리자 이름</label>
                            <input
                                type="text"
                                name="user_name"
                                autoComplete="new-password"
                                {...attrs.is_mand}
                                value={s.values?.user_name || ''}
                                placeholder=""
                                onChange={fn.handleChange}
                                className={cls(s.errors['user_name'] ? 'border-danger' : '', 'form-control')}
                            />
                            {s.errors['user_name'] && <div className="form-error">{s.errors['user_name']}</div>}
                        </div>
                        <div className="col-span-1">
                            <label className="form-label">일반전화번호</label>
                            <input
                                type="text"
                                name="tel"
                                autoComplete="new-password"
                                value={s.values?.tel || ''}
                                placeholder=""
                                onChange={fn.handleChange}
                                className={cls(s.errors['tel'] ? 'border-danger' : '', 'form-control')}
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="form-label">휴대전화</label>
                            <input
                                type="text"
                                name="mobile"
                                autoComplete="new-password"
                                {...attrs.is_mobile}
                                value={s.values?.mobile || ''}
                                placeholder=""
                                onChange={fn.handleChange}
                                className={cls(s.errors['mobile'] ? 'border-danger' : '', 'form-control')}
                            />
                            {s.errors['mobile'] && <div className="form-error">{s.errors['mobile']}</div>}
                        </div>
                        <div className="col-span-1">
                            <label className="form-label">이메일</label>
                            <input
                                type="text"
                                name="email"
                                autoComplete="new-password"
                                value={s.values?.email || ''}
                                placeholder=""
                                onChange={fn.handleChange}
                                className={cls(s.errors['email'] ? 'border-danger' : '', 'form-control')}
                            />
                            {s.errors['email'] && <div className="form-error">{s.errors['email']}</div>}
                        </div>

                        <div className="col-span-1">
                            <label className="form-label">부서</label>
                            <input
                                type="text"
                                name="depart"
                                autoComplete="new-password"
                                value={s.values?.depart || ''}
                                placeholder=""
                                onChange={fn.handleChange}
                                className={cls(s.errors['depart'] ? 'border-danger' : '', 'form-control')}
                            />
                            {s.errors['depart'] && <div className="form-error">{s.errors['depart']}</div>}
                        </div>
                        <div className="col-span-1">
                            <label className="form-label">역할</label>
                            <div className="grid grid-cols-2 checkbox_filter !m-0 !p-0 !border-t-0">
                                {filter.roles?.map((v: any, i: number) => (
                                    <div className="checkboxs_wrap" key={i} style={{ height: 'auto' }}>
                                        <label>
                                            <input
                                                id={`roles-${i}`}
                                                checked={s.values?.roles.filter(p => p == v.uid) == checkNumeric(v.uid) ? true : false}
                                                onChange={fn.handleCheckboxGroupForInteger}
                                                type="checkbox"
                                                value={v.uid}
                                                name="roles"
                                            />
                                            <span className="ml-3">
                                                {v.name} ({v.menus.length})
                                            </span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="fixed bottom-0 w-full">
                        <div className="grid grid-cols-3 gap-4">
                            <button className="btn-del text-red-500" type="button" onClick={deleting}>
                                삭제
                            </button>
                            <button className="btn-save col-span-2 hover:bg-blue-600" disabled={s.submitting}>
                                저장
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </LayoutPopup>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    setContext(ctx);
    var request = {
        uid: ctx.query.uid,
    };
    var response: any = {};
    try {
        const { data } = await api.post(`/be/admin/setup/manager/read`, request);
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

export default SetupManagerEdit;
