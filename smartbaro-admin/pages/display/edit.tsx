import type { GetServerSideProps, NextPage, NextPageContext } from 'next';
import React, { useEffect } from 'react';
import { api, setContext } from '@/libs/axios';
import { cls } from '@/libs/utils';

import useForm from '@/components/form/useForm';

const MainEdit: NextPage = (props: any) => {
    useEffect(() => {
        if (props) {
            s.setValues(props.response);
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
            const params = { ...s.values };

            if (mode == 'REG' && params.uid > 0) {
                mode = 'MOD';
            }
            params.mode = mode;

            const { data } = await api.post(`/be/admin/main/edit`, params);
            s.setSubmitting(false);
            if (data.code == 200) {
                alert(data.msg);
            } else {
                alert(data.msg);
            }
        } catch (e: any) {}
    };

    return (
        <>
            <form onSubmit={fn.handleSubmit} noValidate>
                <div className="edit_popup w-full bg-slate-100 mx-auto py-10" style={{ minHeight: '100vh' }}>
                    <div className="px-9">
                        <div className="text-2xl font-semibold">메인영역 {s.values.uid > 0 ? '수정' : '등록'}</div>

                        <div className="card_area">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="w-full col-span-2">
                                    <label className="form-label">영역썸네일</label>
                                    <input
                                        name="area_thumb-file"
                                        type="file"
                                        className={cls(s.errors['area_thumb'] ? 'border-danger' : '', 'form-control')}
                                        accept="image/*"
                                        onChange={e => {
                                            fn.handleFileUpload(e, { upload_path: '/main/thumb/', file_type: 'img' });
                                        }}
                                    />
                                    {s.values.area_thumb ? <img src={s.values.area_thumb} className="my-3" alt="area_thumb" /> : ''}
                                </div>
                                <div className="col-span-1">
                                    <label className="form-label">영역명</label>
                                    <input
                                        type="text"
                                        name="area_name"
                                        {...attrs.is_mand}
                                        value={s.values?.area_name || ''}
                                        placeholder=""
                                        onChange={fn.handleChange}
                                        className={cls(s.errors['area_name'] ? 'border-danger' : '', 'form-control')}
                                    />
                                    {s.errors['area_name'] && <div className="form-error">{s.errors['area_name']}</div>}
                                </div>
                                <div className="col-span-1">
                                    <label className="form-label">영역코드</label>
                                    <input
                                        type="text"
                                        name="area"
                                        {...attrs.is_mand}
                                        value={s.values?.area || ''}
                                        placeholder=""
                                        onChange={fn.handleChange}
                                        className={cls(s.errors['area'] ? 'border-danger' : '', 'form-control')}
                                    />
                                    {s.errors['area'] && <div className="form-error">{s.errors['area']}</div>}
                                </div>
                                <div className="col-span-1">
                                    <label className="form-label">영역플랫폼</label>
                                    <input
                                        type="text"
                                        name="area_class"
                                        value={s.values?.area_class || ''}
                                        placeholder=""
                                        onChange={fn.handleChange}
                                        className={cls(s.errors['area_class'] ? 'border-danger' : '', 'form-control')}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="form-label">영역순서</label>
                                    <input
                                        type="text"
                                        name="area_sort"
                                        value={s.values?.area_sort || ''}
                                        placeholder=""
                                        onChange={fn.handleChange}
                                        className={cls(s.errors['area_sort'] ? 'border-danger' : '', 'form-control')}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="form-label">진열여부</label>
                                    <input
                                        type="text"
                                        name="is_display"
                                        value={s.values?.is_display || ''}
                                        placeholder=""
                                        onChange={fn.handleChange}
                                        className={cls(s.errors['is_display'] ? 'border-danger' : '', 'form-control')}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="form-label">쓰기권한</label>
                                    <input
                                        type="text"
                                        name="per_write"
                                        value={s.values?.per_write || ''}
                                        placeholder=""
                                        onChange={fn.handleChange}
                                        className={cls(s.errors['per_write'] ? 'border-danger' : '', 'form-control')}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="form-label">노출타입</label>
                                    <input
                                        type="text"
                                        name="display_type"
                                        {...attrs.is_mand}
                                        value={s.values?.display_type || ''}
                                        placeholder=""
                                        onChange={fn.handleChange}
                                        className={cls(s.errors['display_type'] ? 'border-danger' : '', 'form-control')}
                                    />
                                    {s.errors['display_type'] && <div className="form-error">{s.errors['display_type']}</div>}
                                </div>
                                <div className="col-span-1">
                                    <label className="form-label">컨텐츠 번호</label>
                                    <input
                                        type="text"
                                        name="cont_uid"
                                        value={s.values?.cont_uid || ''}
                                        placeholder=""
                                        onChange={fn.handleChange}
                                        className={cls(s.errors['cont_uid'] ? 'border-danger' : '', 'form-control')}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="form-label">컨텐츠타입</label>
                                    <input
                                        type="text"
                                        name="cont_type"
                                        {...attrs.is_mand}
                                        value={s.values?.cont_type || ''}
                                        placeholder=""
                                        onChange={fn.handleChange}
                                        className={cls(s.errors['cont_type'] ? 'border-danger' : '', 'form-control')}
                                    />
                                    {s.errors['cont_type'] && <div className="form-error">{s.errors['cont_type']}</div>}
                                </div>
                            </div>
                        </div>

                        <div className="offcanvas-footer grid grid-cols-3 gap-4 !p-0 my-5">
                            <button className="btn-del" type="button" onClick={deleting}>
                                삭제
                            </button>
                            <button className="btn-save col-span-2 hover:bg-blue-600" disabled={s.submitting}>
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    setContext(ctx);
    var request = {
        uid: ctx.query.uid,
    };
    var response: any = {};
    try {
        const { data } = await api.post(`/be/admin/main/read`, request);
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

export default MainEdit;
