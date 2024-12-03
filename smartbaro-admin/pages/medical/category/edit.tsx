import type { GetServerSideProps, NextPage } from 'next';
import React, { useState, useEffect, useRef } from 'react';
import { api, setContext } from '@/libs/axios';
import { cls } from '@/libs/utils';

import useForm from '@/components/form/useForm';

const MedicalCategoryEdit: NextPage = (props: any) => {
    const [filter, setFilter] = useState<any>([]);
    useEffect(() => {
        if (props) {
            s.setValues(props.response);
            setFilter(props.response.filter);
        }
    }, [props]);

    const contentRef = useRef<any>();
    const { s, fn, attrs } = useForm({
        initialValues: {
            is_reserve: 'T',
        },
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
            params.table_name = 'T_DOCTOR';
            params.cuid = params.uid;

            const { data } = await api.post(`/be/admin/medical/edit`, params);
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
                        {process.env.NODE_ENV == 'development' && (
                            <pre className="">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* <div>
                                        <div className="font-bold mb-3 text-red-500">filter</div>
                                        {JSON.stringify(filter, null, 4)}
                                    </div> */}
                                    <div>
                                        <div className="font-bold mb-3 text-red-500">s.values</div>
                                        {JSON.stringify(s.values, null, 4)}
                                    </div>
                                </div>
                            </pre>
                        )}

                        <div className="card_area mb-20">
                            <div className="text-2xl font-semibold text-center mb-10">진료과목 {s.values.uid > 0 ? '수정' : '등록'}</div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <label className="form-label">진료과목</label>
                                    <input
                                        type="text"
                                        name="cate_name"
                                        {...attrs.is_mand}
                                        value={s.values?.cate_name || ''}
                                        placeholder=""
                                        onChange={fn.handleChange}
                                        className={cls(s.errors['cate_name'] ? 'border-danger' : '', 'form-control')}
                                    />
                                    {s.errors['cate_name'] && <div className="form-error">{s.errors['cate_name']}</div>}
                                </div>
                                <div className="col-span-1">
                                    <label className="form-label">순서</label>
                                    <input
                                        type="text"
                                        name="cate_sort"
                                        value={s.values?.cate_sort || ''}
                                        placeholder=""
                                        onChange={fn.handleChange}
                                        className={cls(s.errors['cate_sort'] ? 'border-danger' : '', 'form-control')}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="form-label">예약가능여부</label>
                                    <select
                                        name="is_reserve"
                                        {...attrs.is_mand}
                                        value={s.values?.is_reserve || ''}
                                        onChange={fn.handleChange}
                                        className={cls(s.errors['is_reserve'] ? 'border-danger' : '', 'form-select')}
                                    >
                                        <option value="">선택</option>
                                        <option value="T">가능</option>
                                        <option value="F">불가능</option>
                                    </select>
                                    {s.errors['is_reserve'] && <div className="form-error">{s.errors['is_reserve']}</div>}
                                </div>
                                <div className="w-full col-span-2">
                                    <label className="form-label">아이콘</label>
                                    <input
                                        name="cate_icon-file"
                                        type="file"
                                        className={cls(s.errors['cate_icon'] ? 'border-danger' : '', 'form-control')}
                                        accept="image/*"
                                        onChange={e => {
                                            fn.handleFileUpload(e, { upload_path: '/medical/category/', file_type: 'img' });
                                        }}
                                    />
                                    {s.values.cate_icon ? <img src={s.values.cate_icon} className="my-3" alt="cate_icon" /> : ''}
                                </div>
                            </div>
                            {/* end grid */}
                            <div className="offcanvas-footer grid grid-cols-1 gap-4 mt-5 !border-0 !px-0">
                                <button className="btn-save col-span-1 hover:bg-blue-600" disabled={s.submitting}>
                                    저장
                                </button>
                            </div>
                        </div>
                        {/* card_area */}
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
        const { data } = await api.post(`/be/admin/medical/read`, request);
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

export default MedicalCategoryEdit;
