import type { GetServerSideProps, NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { api, setContext } from '@/libs/axios';
import { useRouter } from 'next/router';
import { cls, checkNumeric } from '@/libs/utils';
import { ReactSortable } from 'react-sortablejs';

import useForm from '@/components/form/useForm';
import LayoutPopup from '@/components/LayoutPopup';

const MedicalCategoryEdit: NextPage = (props: any) => {
    const router = useRouter();
    const [doctorInfos, setDoctorInfos] = useState<any>([]);
    const [filter, setFilter] = useState<any>({ roles: [] });
    const [sort, setSort] = useState<any>([]);
    const [sortDiff, setSortDiff] = useState<boolean>(false);

    const { s, fn, attrs } = useForm({
        initialValues: {},
        onSubmit: async () => {
            await editing('REG');
        },
    });

    useEffect(() => {
        if (props) {
            s.setValues(props.response.values);
            setFilter(props.response.filter);
            setDoctorInfos(props.response.doctor_infos);
        }
    }, [props]);

    useEffect(() => {
        if (sort.length == 0) {
            doctorInfos?.map((v: any) => {
                setSort(current => [...current, v.uid]);
            });
        } else {
            var sort_diff = false;
            doctorInfos?.map((v: any, i: number) => {
                if (v.uid != sort[i]) {
                    sort_diff = true;
                }
            });
            if (sort_diff) {
                setSort([]);
                doctorInfos?.map((v: any) => {
                    setSort(current => [...current, v.uid]);
                });
                setSortDiff(sort_diff);
            }
        }
    }, [doctorInfos]);

    const deleting = () => editing('DEL');

    const editing = async mode => {
        try {
            const params = { ...s.values };
            if (mode == 'REG' && params.uid > 0) {
                mode = 'MOD';
            }

            if (mode == 'DEL') {
                if (!confirm('정말로 삭제하시겠습니까 ?')) {
                    return;
                }
            }

            params.mode = mode;
            if (
                params.am_week_1 == null &&
                params.am_week_2 == null &&
                params.am_week_3 == null &&
                params.am_week_4 == null &&
                params.am_week_5 == null &&
                params.pm_week_1 == null &&
                params.pm_week_2 == null &&
                params.pm_week_3 == null &&
                params.pm_week_4 == null &&
                params.pm_week_5 == null
            ) {
                params.doctor_schedule_reset = true; // 의료진 시간표 삭제
            }

            if (
                params.am_week_1 != null &&
                params.am_week_2 != null &&
                params.am_week_3 != null &&
                params.am_week_4 != null &&
                params.am_week_5 != null &&
                params.pm_week_1 != null &&
                params.pm_week_2 != null &&
                params.pm_week_3 != null &&
                params.pm_week_4 != null &&
                params.pm_week_5 != null
            ) {
                params.doctor_schedule_reset = false; // 의료진 시간표 등록/수정
            }

            if (typeof params.doctor_schedule_reset === 'undefined') {
                alert('체크가 안된 의료진 시간표가 있습니다. 의료진 시간표를 전체 체크 또는 전체 해제 해주세요.');
                s.setSubmitting(false);
                return;
            }

            const { data } = await api.post(`/be/admin/medical/doctor/edit`, params);
            s.setSubmitting(false);
            if (data.code == 200) {
                alert(data.msg);
                if (mode == 'DEL') {
                    window.close();
                } else {
                    router.replace('/medical/doctor/edit?uid=' + data.uid);
                }
            } else {
                alert(data.msg);
            }
        } catch (e: any) {}
    };

    // 상세정보 edit
    const addInfo = async item => {
        try {
            const params = { ...s.values };

            if (item > 0) {
                params.mode = 'DEL';
            } else {
                params.mode = 'REG';
            }

            var confirmMsg = '상세정보를 삭제하시겠습니까?';
            if (params.mode == 'DEL') {
                if (!confirm(confirmMsg)) {
                    return;
                }
            }

            params.doctor_uid = params.uid;
            params.uid = item;

            const { data } = await api.post(`/be/admin/medical/doctor_info/edit`, params);
            s.setSubmitting(false);
            if (data.code == 200) {
                alert(data.msg);

                const copy = [...doctorInfos];

                if (data.msg == '등록 완료') {
                    copy.push(data);
                    setDoctorInfos(copy);

                    const copy_sort = [...sort];
                    copy_sort.push(data.uid);
                    setSort(copy_sort);

                    const copy_values = { ...s.values };
                    copy_values.subject = null;
                    copy_values.contents = null;
                    s.setValues(copy_values);
                } else if (data.msg == '삭제 완료') {
                    let temp: any = [];
                    for (var i = 0; i < copy.length; i++) {
                        if (data.uid != copy[i].uid) {
                            temp.push(copy[i]);
                        }
                    }
                    setDoctorInfos(temp);

                    let temp_sort: any = [];
                    for (var i = 0; i < sort.length; i++) {
                        if (data.uid != sort[i]) {
                            temp_sort.push(sort[i]);
                        }
                    }
                    setSort(temp_sort);
                }
            } else {
                alert(data.msg);
            }
        } catch (e: any) {}
    };

    // 시간표 삭제
    const delSchedule = async item => {
        const copy = { ...s.values };
        copy.am_week_1 = null;
        copy.am_week_2 = null;
        copy.am_week_3 = null;
        copy.am_week_4 = null;
        copy.am_week_5 = null;
        copy.pm_week_1 = null;
        copy.pm_week_2 = null;
        copy.pm_week_3 = null;
        copy.pm_week_4 = null;
        copy.pm_week_5 = null;
        s.setValues(copy);
    };

    const sortableOptions = {
        animation: 150,
        handle: '.handle',
    };

    const sorting = async itme => {
        try {
            const p = {
                mode: 'SORT',
                doctor_uid: s.values.uid,
                sort_array: sort,
            };

            const { data } = await api.post(`/be/admin/medical/doctor_info/edit`, p);
            if (data.code == 200) {
                alert(data.msg);
            } else {
                alert(data.msg);
            }
        } catch (e: any) {}
    };

    const fn_check_schedule = () => {
        if (
            s.values.am_week_1 == null &&
            s.values.am_week_2 == null &&
            s.values.am_week_3 == null &&
            s.values.am_week_4 == null &&
            s.values.am_week_5 == null &&
            s.values.pm_week_1 == null &&
            s.values.pm_week_2 == null &&
            s.values.pm_week_3 == null &&
            s.values.pm_week_4 == null &&
            s.values.pm_week_5 == null
        ) {
            return false;
        }

        return true;
    };

    return (
        <LayoutPopup title={`의료진 기본 정보 ${s.values.uid > 0 ? '수정' : '등록'}`}>
            <form onSubmit={fn.handleSubmit} noValidate>
                <div className="edit_popup w-full bg-slate-100 mx-auto py-10" style={{ minHeight: '100vh' }}>
                    <div className="px-9">
                        <div className="card_area mb-20">
                            <div className="text-2xl font-semibold text-center mb-10">의료진 기본 정보{s.values.uid > 0 ? '수정' : '등록'}</div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <label className="form-label">의료진명</label>
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
                                <div className="col-span-1">
                                    <label className="form-label">직책</label>
                                    <input
                                        type="text"
                                        name="position"
                                        {...attrs.is_mand}
                                        value={s.values?.position || ''}
                                        placeholder=""
                                        onChange={fn.handleChange}
                                        className={cls(s.errors['position'] ? 'border-danger' : '', 'form-control')}
                                    />
                                    {s.errors['position'] && <div className="form-error">{s.errors['position']}</div>}
                                </div>

                                <div className="col-span-1">
                                    <label className="form-label">전문분야 대표키워드</label>
                                    <input
                                        type="text"
                                        name="field_keyword"
                                        value={s.values?.field_keyword || ''}
                                        placeholder=""
                                        onChange={fn.handleChange}
                                        className={cls(s.errors['field_keyword'] ? 'border-danger' : '', 'form-control')}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="form-label">전문분야 전체</label>
                                    <input
                                        type="text"
                                        name="field_spec"
                                        value={s.values?.field_spec || ''}
                                        placeholder=""
                                        onChange={fn.handleChange}
                                        className={cls(s.errors['field_spec'] ? 'border-danger' : '', 'form-control')}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="form-label">경력</label>
                                    <textarea
                                        name="career"
                                        rows={7}
                                        value={s.values?.career || ''}
                                        placeholder=""
                                        onChange={fn.handleTextAreaChange}
                                        className={cls(s.errors['career'] ? 'border-danger' : '', 'form-control')}
                                    ></textarea>
                                </div>
                                <div className="col-span-1">
                                    <label className="form-label">진료과목</label>
                                    <div className="grid grid-cols-2 checkbox_filter !m-0 !p-0 !border-t-0">
                                        {filter?.cate_uid?.map((v: any, i: number) => (
                                            <div className="checkboxs_wrap" key={i} style={{ height: 'auto' }}>
                                                <label>
                                                    <input
                                                        id={`cate_uid-${i}`}
                                                        checked={s.values?.cate_uid.filter(p => p == v.key) == checkNumeric(v.key) ? true : false}
                                                        onChange={fn.handleCheckboxGroupForInteger}
                                                        type="checkbox"
                                                        value={v.key}
                                                        name="cate_uid"
                                                    />
                                                    <span className="ml-3">{v.value}</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-full col-span-2">
                                    <label className="form-label">프로필 이미지</label>
                                    <input
                                        name="profile-file"
                                        type="file"
                                        className={cls(s.errors['profile'] ? 'border-danger' : '', 'form-control')}
                                        accept="image/*"
                                        onChange={e => {
                                            fn.handleFileUpload(e, { upload_path: '/medical/doctor/', file_type: 'img' });
                                        }}
                                    />
                                    {s.values.profile ? <img src={s.values.profile} className="my-3" alt="profile" /> : ''}
                                </div>
                                <div className="w-full col-span-2">
                                    <label className="form-label">기타 이미지</label>
                                    <input
                                        name="thumb-file"
                                        type="file"
                                        className={cls(s.errors['thumb'] ? 'border-danger' : '', 'form-control')}
                                        accept="image/*"
                                        onChange={e => {
                                            fn.handleFileUpload(e, { upload_path: '/medical/doctor/', file_type: 'img' });
                                        }}
                                    />
                                    {s.values.thumb ? <img src={s.values.thumb} className="my-3" alt="thumb" /> : ''}
                                </div>
                            </div>

                            <div className="text-2xl font-semibold text-center mt-16 mb-5">의료진 시간표 {s.values.uid > 0 ? '수정' : '등록'}</div>
                            <div className="grid grid-cols-2 items-center">
                                <div className="text-left mb-2 text-red-500">* 시간표가 불필요한 의료진은 선택안하고 저장하면 됩니다.</div>
                                {fn_check_schedule() && (
                                    <div className="text-right">
                                        <button
                                            type="button"
                                            className="btn-newadd"
                                            onClick={() => {
                                                delSchedule({ uid: s.values.uid });
                                            }}
                                        >
                                            시간표 초기화
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="common-table">
                                <table className="w-full">
                                    <tbody>
                                        <tr className="">
                                            <th className="">구분</th>
                                            <th>월</th>
                                            <th>화</th>
                                            <th>수</th>
                                            <th>목</th>
                                            <th>금</th>
                                        </tr>
                                        <tr className="">
                                            <td>오전</td>
                                            <td>
                                                <div className="inline-block">
                                                    <div className="flex items-center mb-1">
                                                        <input
                                                            name="am_week_1"
                                                            id="am_week_1_m"
                                                            checked={s.values.am_week_1 == '진료' ? true : false}
                                                            type="radio"
                                                            value="진료"
                                                            className="w-4 h-4 me-1"
                                                            onChange={fn.handleChange}
                                                        />
                                                        <label htmlFor="am_week_1_m" className="text-sm font-medium">
                                                            진료
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            name="am_week_1"
                                                            id="am_week_1_o"
                                                            checked={s.values.am_week_1 == '수술' ? true : false}
                                                            type="radio"
                                                            value="수술"
                                                            className="w-4 h-4 me-1"
                                                            onChange={fn.handleChange}
                                                        />
                                                        <label htmlFor="am_week_1_o" className=" text-sm font-medium">
                                                            수술
                                                        </label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="inline-block">
                                                    <div className="flex items-center mb-1">
                                                        <input
                                                            name="am_week_2"
                                                            id="am_week_2_m"
                                                            checked={s.values.am_week_2 == '진료' ? true : false}
                                                            type="radio"
                                                            value="진료"
                                                            className="w-4 h-4 me-1"
                                                            onChange={fn.handleChange}
                                                        />
                                                        <label htmlFor="am_week_2_m" className="text-sm font-medium">
                                                            진료
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            name="am_week_2"
                                                            id="am_week_2_o"
                                                            checked={s.values.am_week_2 == '수술' ? true : false}
                                                            type="radio"
                                                            value="수술"
                                                            className="w-4 h-4 me-1"
                                                            onChange={fn.handleChange}
                                                        />
                                                        <label htmlFor="am_week_2_o" className=" text-sm font-medium">
                                                            수술
                                                        </label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="inline-block">
                                                    <div className="flex items-center mb-1">
                                                        <input
                                                            name="am_week_3"
                                                            id="am_week_3_m"
                                                            checked={s.values.am_week_3 == '진료' ? true : false}
                                                            type="radio"
                                                            value="진료"
                                                            className="w-4 h-4 me-1"
                                                            onChange={fn.handleChange}
                                                        />
                                                        <label htmlFor="am_week_3_m" className="text-sm font-medium">
                                                            진료
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            name="am_week_3"
                                                            id="am_week_3_o"
                                                            checked={s.values.am_week_3 == '수술' ? true : false}
                                                            type="radio"
                                                            value="수술"
                                                            className="w-4 h-4 me-1"
                                                            onChange={fn.handleChange}
                                                        />
                                                        <label htmlFor="am_week_3_o" className=" text-sm font-medium">
                                                            수술
                                                        </label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="inline-block">
                                                    <div className="flex items-center mb-1">
                                                        <input
                                                            name="am_week_4"
                                                            id="am_week_4_m"
                                                            checked={s.values.am_week_4 == '진료' ? true : false}
                                                            type="radio"
                                                            value="진료"
                                                            className="w-4 h-4 me-1"
                                                            onChange={fn.handleChange}
                                                        />
                                                        <label htmlFor="am_week_4_m" className="text-sm font-medium">
                                                            진료
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            name="am_week_4"
                                                            id="am_week_4_o"
                                                            checked={s.values.am_week_4 == '수술' ? true : false}
                                                            type="radio"
                                                            value="수술"
                                                            className="w-4 h-4 me-1"
                                                            onChange={fn.handleChange}
                                                        />
                                                        <label htmlFor="am_week_4_o" className=" text-sm font-medium">
                                                            수술
                                                        </label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="inline-block">
                                                    <div className="flex items-center mb-1">
                                                        <input
                                                            name="am_week_5"
                                                            id="am_week_5_m"
                                                            checked={s.values.am_week_5 == '진료' ? true : false}
                                                            type="radio"
                                                            value="진료"
                                                            className="w-4 h-4 me-1"
                                                            onChange={fn.handleChange}
                                                        />
                                                        <label htmlFor="am_week_5_m" className="text-sm font-medium">
                                                            진료
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            name="am_week_5"
                                                            id="am_week_5_o"
                                                            checked={s.values.am_week_5 == '수술' ? true : false}
                                                            type="radio"
                                                            value="수술"
                                                            className="w-4 h-4 me-1"
                                                            onChange={fn.handleChange}
                                                        />
                                                        <label htmlFor="am_week_5_o" className=" text-sm font-medium">
                                                            수술
                                                        </label>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="">
                                            <td>오후</td>
                                            <td>
                                                <div className="inline-block">
                                                    <div className="flex items-center mb-1">
                                                        <input
                                                            name="pm_week_1"
                                                            id="pm_week_1_m"
                                                            checked={s.values.pm_week_1 == '진료' ? true : false}
                                                            type="radio"
                                                            value="진료"
                                                            className="w-4 h-4 me-1"
                                                            onChange={fn.handleChange}
                                                        />
                                                        <label htmlFor="pm_week_1_m" className="text-sm font-medium">
                                                            진료
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            name="pm_week_1"
                                                            id="pm_week_1_o"
                                                            checked={s.values.pm_week_1 == '수술' ? true : false}
                                                            type="radio"
                                                            value="수술"
                                                            className="w-4 h-4 me-1"
                                                            onChange={fn.handleChange}
                                                        />
                                                        <label htmlFor="pm_week_1_o" className=" text-sm font-medium">
                                                            수술
                                                        </label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="inline-block">
                                                    <div className="flex items-center mb-1">
                                                        <input
                                                            name="pm_week_2"
                                                            id="pm_week_2_m"
                                                            checked={s.values.pm_week_2 == '진료' ? true : false}
                                                            type="radio"
                                                            value="진료"
                                                            className="w-4 h-4 me-1"
                                                            onChange={fn.handleChange}
                                                        />
                                                        <label htmlFor="pm_week_2_m" className="text-sm font-medium">
                                                            진료
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            name="pm_week_2"
                                                            id="pm_week_2_o"
                                                            checked={s.values.pm_week_2 == '수술' ? true : false}
                                                            type="radio"
                                                            value="수술"
                                                            className="w-4 h-4 me-1"
                                                            onChange={fn.handleChange}
                                                        />
                                                        <label htmlFor="pm_week_2_o" className=" text-sm font-medium">
                                                            수술
                                                        </label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="inline-block">
                                                    <div className="flex items-center mb-1">
                                                        <input
                                                            name="pm_week_3"
                                                            id="pm_week_3_m"
                                                            checked={s.values.pm_week_3 == '진료' ? true : false}
                                                            type="radio"
                                                            value="진료"
                                                            className="w-4 h-4 me-1"
                                                            onChange={fn.handleChange}
                                                        />
                                                        <label htmlFor="pm_week_3_m" className="text-sm font-medium">
                                                            진료
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            name="pm_week_3"
                                                            id="pm_week_3_o"
                                                            checked={s.values.pm_week_3 == '수술' ? true : false}
                                                            type="radio"
                                                            value="수술"
                                                            className="w-4 h-4 me-1"
                                                            onChange={fn.handleChange}
                                                        />
                                                        <label htmlFor="pm_week_3_o" className=" text-sm font-medium">
                                                            수술
                                                        </label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="inline-block">
                                                    <div className="flex items-center mb-1">
                                                        <input
                                                            name="pm_week_4"
                                                            id="pm_week_4_m"
                                                            checked={s.values.pm_week_4 == '진료' ? true : false}
                                                            type="radio"
                                                            value="진료"
                                                            className="w-4 h-4 me-1"
                                                            onChange={fn.handleChange}
                                                        />
                                                        <label htmlFor="pm_week_4_m" className="text-sm font-medium">
                                                            진료
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            name="pm_week_4"
                                                            id="pm_week_4_o"
                                                            checked={s.values.pm_week_4 == '수술' ? true : false}
                                                            type="radio"
                                                            value="수술"
                                                            className="w-4 h-4 me-1"
                                                            onChange={fn.handleChange}
                                                        />
                                                        <label htmlFor="pm_week_4_o" className=" text-sm font-medium">
                                                            수술
                                                        </label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="inline-block">
                                                    <div className="flex items-center mb-1">
                                                        <input
                                                            name="pm_week_5"
                                                            id="pm_week_5_m"
                                                            checked={s.values.pm_week_5 == '진료' ? true : false}
                                                            type="radio"
                                                            value="진료"
                                                            className="w-4 h-4 me-1"
                                                            onChange={fn.handleChange}
                                                        />
                                                        <label htmlFor="pm_week_5_m" className="text-sm font-medium">
                                                            진료
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            name="pm_week_5"
                                                            id="pm_week_5_o"
                                                            checked={s.values.pm_week_5 == '수술' ? true : false}
                                                            type="radio"
                                                            value="수술"
                                                            className="w-4 h-4 me-1"
                                                            onChange={fn.handleChange}
                                                        />
                                                        <label htmlFor="pm_week_5_o" className=" text-sm font-medium">
                                                            수술
                                                        </label>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            {/* end grid */}
                            <div className="offcanvas-footer grid grid-cols-3 gap-4 mt-10 !border-0 !px-0">
                                <button className="btn-del border" type="button" onClick={deleting}>
                                    삭제
                                </button>
                                <button className="btn-save col-span-2 hover:bg-blue-600" disabled={s.submitting}>
                                    저장
                                </button>
                                {/* <button className="btn-save col-span-2 hover:bg-blue-600" onClick={e => editing(e, 'REG')}>
                                    저장
                                </button>*/}
                            </div>
                        </div>
                        {/* card_area */}

                        {s.values.uid > 0 && (
                            <div className="card_area mb-20">
                                <div className="text-2xl font-semibold text-center mb-10">의료진 상세정보</div>
                                <table className="form-table table table-bordered align-middle mb-3 w-full border-b">
                                    <tbody className="border-t-2 border-black">
                                        <tr>
                                            <th scope="row">
                                                <span className="">상세정보</span>
                                            </th>
                                            <td colSpan={3}>
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    value={s.values?.subject || ''}
                                                    placeholder="제목을 입력해주세요."
                                                    onChange={fn.handleChange}
                                                    className={cls(s.errors['subject'] ? 'border-danger' : '', 'form-control')}
                                                />
                                                <div className="my-2">
                                                    <textarea
                                                        name="contents"
                                                        rows={5}
                                                        value={s.values?.contents || ''}
                                                        placeholder="내용을 입력해주세요."
                                                        onChange={fn.handleTextAreaChange}
                                                        className={cls(s.errors['contents'] ? 'border-danger' : '', 'form-control')}
                                                    />
                                                </div>
                                                <div className="">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            addInfo(0);
                                                        }}
                                                        className="bg-teal-500 w-full p-2 text-sm text-white rounded-sm hover:bg-teal-800"
                                                    >
                                                        상세추가
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                {sortDiff && (
                                    <div className="py-5">
                                        <button
                                            type="button"
                                            className="btn-newadd"
                                            onClick={() => {
                                                sorting(doctorInfos);
                                            }}
                                        >
                                            상세정보 순서 적용하기
                                        </button>
                                        <div className="text-red-600 font-bold ml-5">순서가 변경되었습니다. 적용하기 버튼을 클릭하여 저장해 주세요</div>
                                    </div>
                                )}

                                <div className="mt-5 mb-3">총 {doctorInfos.length}개</div>
                                <div className="col-table border-t">
                                    <div className="col-table-th grid grid-cols-5 sticky top-16 bg-gray-100">
                                        <div className="">순서</div>
                                        <div className="">제목</div>
                                        <div className="col-span-2">내용</div>
                                        <div className="">삭제</div>
                                    </div>

                                    <ReactSortable {...sortableOptions} list={doctorInfos} setList={setDoctorInfos}>
                                        {doctorInfos.map((v: any, i: number) => (
                                            <div key={i} className="col-table-td grid grid-cols-5 bg-white transition duration-300 ease-in-out hover:bg-gray-100">
                                                <div className="handle flex-col cursor-pointer">
                                                    <div>
                                                        <i className="fas fa-sort"></i>
                                                        {v.sort}
                                                    </div>
                                                </div>
                                                <div className="">{v.subject}</div>
                                                <div className="col-span-2 whitespace-pre text-start overflow-auto">{v.contents}</div>

                                                <div className="">
                                                    <button
                                                        type="button"
                                                        className="text-blue-500 underline"
                                                        onClick={() => {
                                                            addInfo(v.uid);
                                                        }}
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </ReactSortable>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </form>
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
        const { data } = await api.post(`/be/admin/medical/doctor/read`, request);
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
