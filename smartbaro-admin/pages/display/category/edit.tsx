import type { GetServerSideProps, NextPage } from 'next';
import React, { useEffect } from 'react';
import { api, setContext } from '@/libs/axios';
import { cls } from '@/libs/utils';

import useForm from '@/components/form/useForm';

const CategoryEdit: NextPage = (props: any) => {
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
            if (mode == 'REG' && s.values.cuid > 0) {
                mode = 'MOD';
            }
            s.values.mode = mode;

            const { data } = await api.post(`/be/admin/cate/edit`, s.values);
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

                        <div className="card_area">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <label className="form-label">카테고리명</label>
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
                                <div className="w-full col-span-2">
                                    <label className="form-label">카테고리 아이콘</label>
                                    <input
                                        name="cate_icon-file"
                                        type="file"
                                        className={cls(s.errors['cate_icon'] ? 'border-danger' : '', 'form-control')}
                                        accept="image/*"
                                        onChange={e => {
                                            fn.handleFileUpload(e, { upload_path: '/main/category/', file_type: 'img' });
                                        }}
                                    />
                                    {s.values.cate_icon ? <img src={s.values.cate_icon} className="my-3" alt="area_thumb" /> : ''}
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
        table_name: ctx.query.table_name,
        table_uid: ctx.query.table_uid,
        cuid: ctx.query.cuid,
    };
    var response: any = {};
    try {
        const { data } = await api.post(`/be/admin/cate/read`, request);
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

export default CategoryEdit;
