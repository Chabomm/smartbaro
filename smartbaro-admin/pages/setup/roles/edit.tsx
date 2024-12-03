import type { GetServerSideProps, NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api, setContext } from '@/libs/axios';
import { checkNumeric, cls } from '@/libs/utils';

import useForm from '@/components/form/useForm';
import LayoutPopup from '@/components/LayoutPopup';

const SetupRolesEdit: NextPage = (props: any) => {
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

            const { data } = await api.post(`/be/admin/setup/manager/roles/edit`, s.values);
            if (data.code == 200) {
                // console.log('datadatadata', data);
                alert(data.msg);
                router.push('/setup/roles/edit?uid=' + data.uid);
            } else {
                alert(data.msg);
            }
            s.setSubmitting(false);
        } catch (e: any) {}
    };

    return (
        <LayoutPopup title="역할 상세정보">
            <div className="card_area mb-20">
                <div className="text-2xl font-semibold text-center mb-10">역할 상세정보</div>
                <form onSubmit={fn.handleSubmit} noValidate className="pb-14">
                    <div className="grid grid-cols-2 gap-4 px-5 pt-5">
                        <div className="col-span-2">
                            <label className="form-label">역할명</label>
                            <input
                                type="text"
                                name="name"
                                {...attrs.is_mand}
                                value={s.values?.name || ''}
                                placeholder=""
                                onChange={fn.handleChange}
                                className={cls(s.errors['name'] ? 'border-danger' : '', 'form-control')}
                            />
                            {s.errors['name'] && <div className="form-error">{s.errors['name']}</div>}
                        </div>

                        <div className="col-span-2">
                            <label className="form-label">메뉴 권한 설정</label>
                            <div className="grid grid-cols-3 checkbox_filter">
                                {filter?.menus?.depth1?.map((v: any, i: number) => (
                                    <div key={'dpeth1-' + i} className="h-min w-full">
                                        <div className="font-bold mt-5 mb-2">{v.name}</div>
                                        {filter?.menus?.depth2
                                            ?.filter(p => p.parent == v.uid)
                                            .map((vv: any, ii: number) => (
                                                <div className="checkboxs_wrap" key={'dpeth2-' + ii} style={{ height: 'auto' }}>
                                                    <label>
                                                        <input
                                                            id={`menus-${ii}`}
                                                            checked={s.values?.menus.filter(p => p == vv.uid) == checkNumeric(vv.uid) ? true : false}
                                                            onChange={fn.handleCheckboxGroupForInteger}
                                                            type="checkbox"
                                                            value={vv.uid}
                                                            name="menus"
                                                        />
                                                        <span className="ml-3">
                                                            {vv.name} [{vv.uid}]
                                                        </span>
                                                    </label>
                                                </div>
                                            ))}
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
        const { data } = await api.post(`/be/admin/setup/manager/roles/read`, request);
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

export default SetupRolesEdit;
