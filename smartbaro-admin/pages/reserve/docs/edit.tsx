import type { GetServerSideProps, NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { api, setContext } from '@/libs/axios';
import { cls } from '@/libs/utils';

import useForm from '@/components/form/useForm';

import Datepicker from 'react-tailwindcss-datepicker';
const ReserveDocsEdit: NextPage = (props: any) => {
    const [filter, setFilter] = useState<any>([]);
    useEffect(() => {
        if (props) {
            s.setValues(props.response);
            setFilter(props.response.filter);
        }
    }, [props]);

    const { s, fn, attrs } = useForm({
        initialValues: {
            state: '',
        },
        onSubmit: async () => {
            await editing('REG');
        },
    });

    const deleting = () => editing('DEL');

    const editing = async mode => {
        try {
            const params = { ...s.values };

            const { data } = await api.post(`/be/admin/reserve/docs/edit`, { uid: params.uid, issue_at: params.issue_at.startDate, state: params.state });
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
                                    <div>
                                        <div className="font-bold mb-3 text-red-500">filter</div>
                                        {JSON.stringify(filter, null, 4)}
                                    </div>
                                    <div>
                                        <div className="font-bold mb-3 text-red-500">s.values</div>
                                        {JSON.stringify(s.values, null, 4)}
                                    </div>
                                </div>
                            </pre>
                        )}

                        <div className="card_area mb-20">
                            <div className="text-2xl font-semibold text-center mb-5">환자 정보</div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <label className="form-label">예약가능여부</label>
                                    <select
                                        name="state"
                                        {...attrs.is_mand}
                                        value={s.values?.state || ''}
                                        onChange={fn.handleChange}
                                        className={cls(s.errors['state'] ? 'border-danger' : '', 'form-select')}
                                    >
                                        <option value="">선택</option>
                                        <option value="접수완료">접수완료</option>
                                        <option value="발급중">발급중</option>
                                        <option value="발급완료">발급완료</option>
                                        <option value="취소">취소</option>
                                    </select>
                                    {s.errors['state'] && <div className="form-error">{s.errors['state']}</div>}
                                </div>
                                <div className="col-span-1">
                                    <label className="form-label">환자 이름</label>
                                    <input type="text" className="form-control" value={s.values?.name} readOnly />
                                </div>
                                <div className="col-span-1">
                                    <label className="form-label">휴대폰 번호</label>
                                    <input type="text" className="form-control" value={s.values?.mobile} readOnly />
                                </div>
                                <div className="col-span-1">
                                    <label className="form-label">전화번호</label>
                                    <input type="text" className="form-control" value={s.values?.tel} readOnly />
                                </div>
                                <div className="w-full col-span-2">
                                    <label className="form-label">주소</label>
                                    <div className="form-control">
                                        <div className="font-bold">({s.values?.post})</div>
                                        <div>{s.values?.addr1}</div>
                                        <div>
                                            {s.values?.addr2} [{s.values?.addr3}]
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-2xl font-semibold text-center mt-16 mb-5">신청인 정보</div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <label className="form-label">이름</label>
                                    <input type="text" className="form-control" value={s.values?.proposer} readOnly />
                                </div>
                                <div className="col-span-1">
                                    <label className="form-label">휴대폰 번호</label>
                                    <input type="text" className="form-control" value={s.values?.proposer_mobile} readOnly />
                                </div>
                                <div className="col-span-1">
                                    <label className="form-label">전화번호</label>
                                    <input type="text" className="form-control" value={s.values?.proposer_tel} readOnly />
                                </div>
                                <div className="w-full col-span-2">
                                    <label className="form-label">주소</label>
                                    <div className="form-control">
                                        <div className="font-bold">({s.values?.proposer_post})</div>
                                        <div>{s.values?.proposer_addr1}</div>
                                        <div>
                                            {s.values?.proposer_addr2} [{s.values?.proposer_addr3}]
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-2xl font-semibold text-center mt-16 mb-5">신청자별 구비서류</div>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <div className="overflow-x-auto">
                                        <table className="grid-table w-full">
                                            <thead className="bg-second text-white">
                                                <tr>
                                                    <th scope="col" colSpan={3} className="grid-table-th">
                                                        신청자
                                                    </th>
                                                    <th scope="col" className="grid-table-th">
                                                        제출서류
                                                    </th>
                                                    <th scope="col" className="grid-table-th">
                                                        비고
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-lg">
                                                <tr className="border-b border-gray-400">
                                                    <td className="grid-table-td">
                                                        <input
                                                            checked={s.values?.relation_type == '환자' ? true : false}
                                                            disabled={s.values?.relation_type == '환자' ? false : true}
                                                            type="radio"
                                                            className="w-4 h-4 mx-2"
                                                        />
                                                    </td>
                                                    <td className="grid-table-td">환자</td>
                                                    <td className="grid-table-td">본인</td>
                                                    <td className="grid-table-td">본인신분증 (제시)</td>
                                                    <td className="grid-table-td">사진있는 신분증</td>
                                                </tr>
                                                <tr className="border-b border-gray-400">
                                                    <td rowSpan={4} className="grid-table-td">
                                                        <input
                                                            checked={s.values?.relation_type == '친족' ? true : false}
                                                            disabled={s.values?.relation_type == '친족' ? false : true}
                                                            type="radio"
                                                            className="w-4 h-4 mx-2"
                                                        />
                                                    </td>
                                                    <td rowSpan={4} className="grid-table-td">
                                                        친족
                                                    </td>
                                                    <td rowSpan={4} className="grid-table-td">
                                                        <div>친족배우자,</div>
                                                        <div>직계존속비속,</div>
                                                        <div>배우자의 직계존속</div>
                                                    </td>
                                                    <td className="grid-table-td">신청자의 신분증(제시)</td>
                                                    <td className="grid-table-td">사진있는 신분증</td>
                                                </tr>
                                                <tr className="border-b border-gray-400">
                                                    <td className="grid-table-td">환자의 신분증 사본</td>
                                                    <td className="grid-table-td">사진있는 신분증, 17세 미만제외</td>
                                                </tr>
                                                <tr className="border-b border-gray-400">
                                                    <td className="grid-table-td">환자의 자필 동의서</td>
                                                    <td className="grid-table-td">만14세 미만은 법정대리인이 작성</td>
                                                </tr>
                                                <tr className="border-b border-gray-400">
                                                    <td className="grid-table-td">가족관계증명서 또는 그 외 확인 가능서류</td>
                                                    <td className="grid-table-td"></td>
                                                </tr>
                                                <tr className="border-b border-gray-400">
                                                    <td rowSpan={4} className="grid-table-td">
                                                        <input
                                                            name="relation_type"
                                                            checked={s.values?.relation_type == '지정대리인' ? true : false}
                                                            type="radio"
                                                            value="지정대리인"
                                                            className="w-4 h-4 mx-2"
                                                            disabled={s.values?.relation_type == '지정대리인' ? false : true}
                                                        />
                                                    </td>
                                                    <td rowSpan={4} className="grid-table-td">
                                                        지정대리인
                                                    </td>
                                                    <td rowSpan={4} className="grid-table-td">
                                                        친족 이외의 대리인
                                                    </td>
                                                    <td className="grid-table-td">신청자의 신분증(제시)</td>
                                                    <td className="grid-table-td">사진있는 신분증</td>
                                                </tr>
                                                <tr className="border-b border-gray-400">
                                                    <td className="grid-table-td">환자의 신분증 사본</td>
                                                    <td className="grid-table-td">사진있는 신분증, 17세 미만제외</td>
                                                </tr>
                                                <tr className="border-b border-gray-400">
                                                    <td className="grid-table-td">환자의 자필 동의서</td>
                                                    <td className="grid-table-td" rowSpan={2} align="center">
                                                        만14세 미만은 법적대리인이 작성
                                                        <br />
                                                        (가족관계증명서 첨부)
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="grid-table-td">환자의 자필 동의서</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="txt-desc">
                                        <div>･ 신분증: 주민등록증, 여권, 운전면허증 그 밖에 공공기관에서 발행한 본인임을 확인할 수 있는 신분증</div>
                                        <div>･ 모든 서류발급시 의료법 제21조에 의거 환자, 그 배우자, 직계존비속 또는 배우자의 직계존속인 경우 구비서류 지참 후 발급가능합니다.</div>
                                        <div>･ 신분증을 지참하지 않은 경우는 신분확인이 되지 않으므로 환자정보보호를 위해 사본발급이 불가합니다.</div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-2xl font-semibold text-center mt-16 mb-5">신청목적</div>
                            <input type="text" className="form-control" value={s.values?.purpose_type} readOnly />

                            <div className="text-2xl font-semibold text-center mt-16 mb-5">제증명 및 서류 요청부분</div>
                            <div className="grid grid-cols-1 normal-text">
                                <div>
                                    <div className="overflow-x-auto">
                                        <table className="grid-table w-full">
                                            <thead className="bg-second text-white">
                                                <tr>
                                                    <th scope="col" className="grid-table-th">
                                                        요청부분
                                                    </th>
                                                    <th scope="col" className="grid-table-th">
                                                        수량
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="text-lg">
                                                {s.values?.request?.map((v: any, i: number) => (
                                                    <tr key={`request_${i}`} className="border-b border-gray-400">
                                                        <td className="grid-table-td">{v.docs_name}</td>
                                                        <td className="grid-table-td">{v.docs_ea}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="subject2 font-bold">발급희망일</div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <label className="form-label">발급희망일</label>
                                    <input type="text" className="form-control" value={s.values?.hope_at} readOnly />
                                </div>

                                <div className="col-span-1">
                                    <label className="form-label">발급일</label>
                                    <Datepicker
                                        containerClassName="relative w-full text-gray-700 border border-gray-300 rounded"
                                        useRange={false}
                                        asSingle={true}
                                        inputName="issue_at"
                                        {...attrs.is_mand}
                                        i18n={'ko'}
                                        value={{
                                            startDate: s.values?.issue_at?.startDate || s.values?.issue_at,
                                            endDate: s.values?.issue_at?.endDate || s.values?.issue_at,
                                        }}
                                        onChange={fn.handleChangeDateRange}
                                    />
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
        const { data } = await api.post(`/be/admin/reserve/docs/read`, request);
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

export default ReserveDocsEdit;
