import type { GetServerSideProps, NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Breadcrumb from '@/components/Breadcrumb';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import Seo from '@/components/Seo';
import useForm from '@/components/form/useForm';
import { cls, getAgentDevice, staticReplace } from '@/libs/utils';
import { left, mid, right } from '@/libs/utils';
import { api, setContext } from '@/libs/axios';
import DaumPost from '@/components/UIcomponent/DaumPost';

import Datepicker from 'react-tailwindcss-datepicker';

const Medical_3_reg: NextPage = (props: any) => {
    const router = useRouter();
    const nav_id = '/medical/3';
    const nav_name = '제증명서류발급';
    const page_header = { nav_id: nav_id, sub_title: nav_name };

    const [daumModal, setDaumModal] = useState(false);

    useEffect(() => {
        if (JSON.stringify(props) !== '{}') {
            s.setValues(props.response);
        }
    }, [props]);

    const { s, fn, attrs } = useForm({
        initialValues: {
            checked: [],
            purpose_type_str: null,
            // docs_name: [],
        },
        onSubmit: async () => {
            await editing('REG');
        },
    });

    const editing = async mode => {
        try {
            const params = { ...s.values };

            if (params.relation_type == undefined || params.relation_type == null) {
                alert('신청자별 구비서류를 선택해주세요');
                const el = document.querySelector("input[name='relation_type']");
                (el as HTMLElement)?.focus();
                s.setSubmitting(false);
                return;
            }

            if (params.purpose_type == undefined || params.purpose_type == null) {
                alert('신청목적을 선택해주세요');
                const el = document.querySelector("input[name='purpose_type']");
                (el as HTMLElement)?.focus();
                s.setSubmitting(false);
                return;
            }

            if (params.purpose_type == '기타') {
                if (params.purpose_type_str == '' || params.purpose_type_str == undefined) {
                    alert('신청목적 기타란에 사유를 입력해주세요');
                    const el = document.querySelector("input[name='purpose_type_str']");
                    (el as HTMLElement)?.focus();
                    s.setSubmitting(false);
                    return;
                } else {
                    params.purpose_type = params.purpose_type_str;
                }
            }

            if (params.hope_at?.startDate == undefined || params.hope_at?.startDate == '') {
                alert('발급희망일을 선택해주세요');
                const el = document.querySelector("input[name='hope_at']");
                (el as HTMLElement)?.focus();
                s.setSubmitting(false);
                return;
            }
            params.hope_at = params.hope_at.startDate;

            // if (params.purpose_type == '기타') {
            //     if (params.purpose_type_str == '') {
            //         alert('제증명');
            //         const el = document.querySelector("input[name='purpose_type_str']");
            //         (el as HTMLElement)?.focus();
            //         s.setSubmitting(false);
            //         return;
            //     } else {
            //         params.purpose_type = params.purpose_type_str;
            //     }
            // }

            if (!params.is_agree || params.is_agree == null) {
                alert('개인정보 수집, 이용에 동의해주세요');
                const el = document.querySelector("input[name='is_agree']");
                (el as HTMLElement)?.focus();
                s.setSubmitting(false);
                return;
            }

            const { data } = await api.post(`/be/reserve/docs/edit`, params);
            if (data.code == 200) {
                alert(data.msg);
                // return;
                router.replace('/medical/3');
            } else {
                alert(data.msg);
                return;
            }
        } catch (e: any) {}
    };

    function goBack() {
        router.back();
    }

    // 체크박스
    const handleRequestDocs = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        const index = value;
        const copy = { ...s.values };
        if (checked) {
            copy.request[index].checked = true;
            copy.request[index].docs_ea = 1;
        } else {
            copy.request[index].checked = false;
            copy.request[index].docs_ea = '';
        }
        s.setValues(copy);
    };

    // 셀렉트박스 (수량)
    const handleRequestEa = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value, dataset } = e.target;
        const index = dataset.index || -1;
        const copy = { ...s.values };
        if (value != '') {
            copy.request[index].checked = true;
            copy.request[index].docs_ea = value;
        } else {
            copy.request[index].checked = false;
            copy.request[index].docs_ea = '';
        }
        s.setValues(copy);
    };

    const [daumModalPrefix, setDaumModalPrefix] = useState('');
    const openDaumPostModal = (prefix: string) => {
        setDaumModalPrefix(prefix);
        setDaumModal(true);
    };

    // 주소 모달에서 선택 후
    const handleCompleteFormSet = (data: any) => {
        s.values[daumModalPrefix + 'post'] = data.zonecode;
        s.values[daumModalPrefix + 'addr1'] = data.roadAddress;
        s.values[daumModalPrefix + 'addr3'] = data.bname;
        const el = document.querySelector("input[name='" + daumModalPrefix + "addr2']");
        (el as HTMLElement)?.focus();
    };

    const handleCopyOrgInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) {
            s.setValues({
                ...s.values,
                ['proposer']: s.values.name,
                ['proposer_mobile']: s.values.mobile,
                ['proposer_tel']: s.values.tel,
                ['proposer_post']: s.values.post,
                ['proposer_addr1']: s.values.addr1,
                ['proposer_addr2']: s.values.addr2,
                ['proposer_addr3']: s.values.addr3,
            });
        } else {
            s.setValues({
                ...s.values,
                ['proposer']: '',
                ['proposer_mobile']: '',
                ['proposer_tel']: '',
                ['proposer_post']: '',
                ['proposer_addr1']: '',
                ['proposer_addr2']: '',
                ['proposer_addr3']: '',
            });
        }
    };

    return (
        <Layout title={nav_name} nav_id={nav_id} device={props.device}>
            <Seo title={nav_name} />
            <PageHeader params={page_header} device={props.device} />
            <Breadcrumb nav_id={nav_id} device={props.device} />

            <div className="subject sub-py">제증명서류발급</div>

            <form onSubmit={fn.handleSubmit} noValidate>
                <section className="site-width reserve-wrap">
                    <div className="site-width reserve-item">
                        <div className="subject2 font-bold !pt-0">환자 정보</div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-9 normal-text">
                            <div>
                                <div className="reserve-box">
                                    <label className="form-label">환자 이름</label>
                                    <input
                                        type="text"
                                        name="name"
                                        {...attrs.is_mand}
                                        value={s.values?.name || ''}
                                        placeholder="환자 이름을 입력해주세요."
                                        onChange={fn.handleChange}
                                        className={cls(s.errors['name'] ? 'border-danger' : '', 'form-control')}
                                    />
                                    {s.errors['name'] && <div className="form-error">{s.errors['name']}</div>}
                                </div>
                                <div className="reserve-box">
                                    <label className="form-label">휴대폰 번호</label>
                                    <input
                                        type="text"
                                        name="mobile"
                                        {...attrs.is_mand}
                                        {...attrs.is_mobile}
                                        value={s.values?.mobile || ''}
                                        placeholder="휴대폰 번호를 입력해주세요."
                                        onChange={fn.handleChange}
                                        className={cls(s.errors['mobile'] ? 'border-danger' : '', 'form-control')}
                                    />
                                    {s.errors['mobile'] && <div className="form-error">{s.errors['mobile']}</div>}
                                </div>
                                <div className="reserve-box">
                                    <label className="form-label">전화번호</label>
                                    <input
                                        type="text"
                                        name="tel"
                                        {...attrs.is_mobile}
                                        value={s.values?.tel || ''}
                                        placeholder="전화번호를 입력해주세요."
                                        onChange={fn.handleChange}
                                        className={cls(s.errors['tel'] ? 'border-danger' : '', 'form-control')}
                                    />
                                </div>
                            </div>
                            <div className="reserve-box">
                                <label className="form-label">주소</label>
                                <div className="grid grid-cols-5 gap-2 mb-2.5">
                                    <input
                                        name="post"
                                        type="text"
                                        value={s.values?.post || ''}
                                        onChange={fn.handleChange}
                                        {...attrs.is_mand}
                                        onClick={() => {
                                            openDaumPostModal('');
                                        }}
                                        className={cls(s.errors['post'] ? 'border-danger' : '', 'form-control col-span-3')}
                                        placeholder="우편번호"
                                        readOnly
                                    />
                                    <button
                                        className="col-span-2 search-btn"
                                        type="button"
                                        onClick={() => {
                                            openDaumPostModal('');
                                        }}
                                    >
                                        우편번호 검색
                                    </button>
                                </div>
                                {s.errors['post'] && <div className="form-error">{s.errors['post']}</div>}
                                <input
                                    type="text"
                                    name="addr1"
                                    value={s.values?.addr1 || ''}
                                    onChange={fn.handleChange}
                                    {...attrs.is_mand}
                                    className={cls(s.errors['addr1'] ? 'border-danger' : '', 'form-control mb-2.5')}
                                    placeholder=""
                                    readOnly
                                />
                                {s.errors['addr1'] && <div className="form-error">{s.errors['addr1']}</div>}
                                <input
                                    type="text"
                                    name="addr2"
                                    {...attrs.is_mand}
                                    value={s.values?.addr2 || ''}
                                    placeholder="상세위치 입력 (예:○○빌딩 2층)"
                                    onChange={fn.handleChange}
                                    className={cls(s.errors['addr2'] ? 'border-danger' : '', 'form-control mb-2.5')}
                                />
                                {s.errors['addr2'] && <div className="form-error">{s.errors['addr2']}</div>}
                                <input
                                    type="text"
                                    name="addr3"
                                    value={s.values?.addr3 || ''}
                                    placeholder="참고항목"
                                    onChange={fn.handleChange}
                                    className={cls(s.errors['addr3'] ? 'border-danger' : '', 'form-control')}
                                />
                            </div>
                        </div>
                        <div className="subject2 font-bold !pt-0">신청인 정보</div>
                        <div className="mb-3">
                            <label>
                                <input type="checkbox" className="me-3" onChange={handleCopyOrgInfo} />
                                환자 인적사항과 동일할 경우 체크해주세요.
                            </label>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-9 normal-text">
                            <div>
                                <div className="reserve-box">
                                    <label className="form-label">이름</label>
                                    <input
                                        type="text"
                                        name="proposer"
                                        {...attrs.is_mand}
                                        value={s.values?.proposer || ''}
                                        placeholder="신청인 이름을 입력해주세요."
                                        onChange={fn.handleChange}
                                        className={cls(s.errors['proposer'] ? 'border-danger' : '', 'form-control')}
                                    />
                                    {s.errors['proposer'] && <div className="form-error">{s.errors['proposer']}</div>}
                                </div>
                                <div className="reserve-box">
                                    <label className="form-label">휴대폰 번호</label>
                                    <input
                                        type="text"
                                        name="proposer_mobile"
                                        {...attrs.is_mand}
                                        {...attrs.is_mobile}
                                        value={s.values?.proposer_mobile || ''}
                                        placeholder="휴대폰 번호를 입력해주세요."
                                        onChange={fn.handleChange}
                                        className={cls(s.errors['proposer_mobile'] ? 'border-danger' : '', 'form-control')}
                                    />
                                    {s.errors['proposer_mobile'] && <div className="form-error">{s.errors['proposer_mobile']}</div>}
                                </div>
                                <div className="reserve-box">
                                    <label className="form-label">전화번호</label>
                                    <input
                                        type="text"
                                        name="proposer_tel"
                                        {...attrs.is_mobile}
                                        value={s.values?.proposer_tel || ''}
                                        placeholder="전화번호를 입력해주세요."
                                        onChange={fn.handleChange}
                                        className={cls(s.errors['proposer_tel'] ? 'border-danger' : '', 'form-control')}
                                    />
                                </div>
                            </div>
                            <div className="reserve-box">
                                <label className="form-label">주소</label>
                                <div className="grid grid-cols-5 gap-2 mb-2.5">
                                    <input
                                        name="proposer_post"
                                        type="text"
                                        value={s.values?.proposer_post || ''}
                                        onChange={fn.handleChange}
                                        {...attrs.is_mand}
                                        onClick={() => {
                                            openDaumPostModal('proposer_');
                                        }}
                                        className={cls(s.errors['proposer_post'] ? 'border-danger' : '', 'form-control col-span-3')}
                                        placeholder="우편번호"
                                        readOnly
                                    />
                                    <button
                                        className="col-span-2 search-btn"
                                        type="button"
                                        onClick={() => {
                                            openDaumPostModal('proposer_');
                                        }}
                                    >
                                        우편번호 검색
                                    </button>
                                </div>
                                {s.errors['post'] && <div className="form-error">{s.errors['post']}</div>}
                                <input
                                    type="text"
                                    name="proposer_addr1"
                                    value={s.values?.proposer_addr1 || ''}
                                    onChange={fn.handleChange}
                                    {...attrs.is_mand}
                                    className={cls(s.errors['proposer_addr1'] ? 'border-danger' : '', 'form-control mb-2.5')}
                                    placeholder=""
                                    readOnly
                                />
                                {s.errors['proposer_addr1'] && <div className="form-error">{s.errors['proposer_addr1']}</div>}
                                <input
                                    type="text"
                                    name="proposer_addr2"
                                    {...attrs.is_mand}
                                    value={s.values?.proposer_addr2 || ''}
                                    placeholder="상세위치 입력 (예:○○빌딩 2층)"
                                    onChange={fn.handleChange}
                                    className={cls(s.errors['proposer_addr2'] ? 'border-danger' : '', 'form-control mb-2.5')}
                                />
                                {s.errors['proposer_addr2'] && <div className="form-error">{s.errors['proposer_addr2']}</div>}
                                <input
                                    type="text"
                                    name="proposer_addr3"
                                    value={s.values?.proposer_addr3 || ''}
                                    placeholder="참고항목"
                                    onChange={fn.handleChange}
                                    className={cls(s.errors['proposer_addr3'] ? 'border-danger' : '', 'form-control')}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="site-width reserve-wrap">
                    <div className="site-width reserve-item">
                        <div className="subject2 font-bold !pt-0">신청자별 구비서류</div>
                        <div className="grid grid-cols-1 normal-text">
                            <div>
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
                                    <tbody className="text-sm font-light lg:text-lg lg:font-normal">
                                        <tr className="border-b border-gray-400">
                                            <td className="grid-table-td">
                                                <input
                                                    name="relation_type"
                                                    checked={s.values.relation_type == '환자' ? true : false}
                                                    type="radio"
                                                    value="환자"
                                                    className="w-4 h-4 mx-2"
                                                    onChange={fn.handleChange}
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
                                                    name="relation_type"
                                                    checked={s.values.relation_type == '친족' ? true : false}
                                                    type="radio"
                                                    value="친족"
                                                    className="w-4 h-4 mx-2"
                                                    onChange={fn.handleChange}
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
                                                    checked={s.values.relation_type == '지정대리인' ? true : false}
                                                    type="radio"
                                                    value="지정대리인"
                                                    className="w-4 h-4 mx-2"
                                                    onChange={fn.handleChange}
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
                                <div className="txt-desc">
                                    <div>･ 신분증: 주민등록증, 여권, 운전면허증 그 밖에 공공기관에서 발행한 본인임을 확인할 수 있는 신분증</div>
                                    <div>･ 모든 서류발급시 의료법 제21조에 의거 환자, 그 배우자, 직계존비속 또는 배우자의 직계존속인 경우 구비서류 지참 후 발급가능합니다.</div>
                                    <div>･ 신분증을 지참하지 않은 경우는 신분확인이 되지 않으므로 환자정보보호를 위해 사본발급이 불가합니다.</div>
                                </div>
                            </div>
                        </div>
                        <div className="subject2 font-bold">신청목적</div>
                        <div className="reserve-box">
                            <label className="form-label">신청목적 선택</label>
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mb-5">
                                <div>
                                    <input
                                        id="purpose_type_1"
                                        checked={s.values.purpose_type == '보험회사' ? true : false}
                                        type="radio"
                                        value="보험회사"
                                        name="purpose_type"
                                        className="peer hidden"
                                        onChange={fn.handleChange}
                                    />
                                    <label htmlFor="purpose_type_1" className="form-radio cate-item peer-checked:bg-second peer-checked:text-white">
                                        <div className="">보험회사</div>
                                    </label>
                                </div>
                                <div>
                                    <input
                                        id="purpose_type_2"
                                        checked={s.values.purpose_type == '타병원' ? true : false}
                                        type="radio"
                                        value="타병원"
                                        name="purpose_type"
                                        className="peer hidden"
                                        onChange={fn.handleChange}
                                    />
                                    <label htmlFor="purpose_type_2" className="form-radio cate-item peer-checked:bg-second peer-checked:text-white">
                                        <div className="">타병원</div>
                                    </label>
                                </div>
                                <div>
                                    <input
                                        id="purpose_type_3"
                                        checked={s.values.purpose_type == '회사' ? true : false}
                                        type="radio"
                                        value="회사"
                                        name="purpose_type"
                                        className="peer hidden"
                                        onChange={fn.handleChange}
                                    />
                                    <label htmlFor="purpose_type_3" className="form-radio cate-item peer-checked:bg-second peer-checked:text-white">
                                        <div className="">회사</div>
                                    </label>
                                </div>
                                <div>
                                    <input
                                        id="purpose_type_4"
                                        checked={s.values.purpose_type == '공공기관' ? true : false}
                                        type="radio"
                                        value="공공기관"
                                        name="purpose_type"
                                        className="peer hidden"
                                        onChange={fn.handleChange}
                                    />
                                    <label htmlFor="purpose_type_4" className="form-radio cate-item peer-checked:bg-second peer-checked:text-white">
                                        <div className="">공공기관</div>
                                    </label>
                                </div>
                                <div>
                                    <input
                                        id="purpose_type_5"
                                        checked={s.values.purpose_type == '병무청' ? true : false}
                                        type="radio"
                                        value="병무청"
                                        name="purpose_type"
                                        className="peer hidden"
                                        onChange={fn.handleChange}
                                    />
                                    <label htmlFor="purpose_type_5" className="form-radio cate-item peer-checked:bg-second peer-checked:text-white">
                                        <div className="">병무청</div>
                                    </label>
                                </div>
                            </div>
                            <div className="flex items-center px-6 py-3 border">
                                <input
                                    id="purpose_type_6"
                                    checked={s.values.purpose_type == '기타' ? true : false}
                                    type="radio"
                                    name="purpose_type"
                                    value="기타"
                                    className=""
                                    onChange={fn.handleChange}
                                />
                                <label htmlFor="purpose_type_6" className="flex-none txt-md font-bold cate-item peer-checked:bg-second peer-checked:text-white mr-5">
                                    기타
                                </label>
                                <input
                                    type="text"
                                    name="purpose_type_str"
                                    placeholder=""
                                    onChange={fn.handleChange}
                                    className={cls(s.errors['purpose_type'] ? 'border-danger' : '', 'form-control')}
                                    disabled={s.values.purpose_type == '기타' ? false : true}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="site-width reserve-wrap">
                    <div className="site-width reserve-item">
                        <div className="subject2 font-bold !pt-0">제증명 및 서류 요청부분</div>
                        <div className="grid grid-cols-1 normal-text">
                            <div>
                                <table className="grid-table w-full">
                                    <thead className="bg-second text-white">
                                        <tr>
                                            <th scope="col" colSpan={2} className="grid-table-th">
                                                요청부분
                                            </th>
                                            <th scope="col" className="grid-table-th">
                                                수량
                                            </th>
                                            <th scope="col" className="grid-table-th">
                                                금액
                                            </th>
                                            <th scope="col" className="grid-table-th">
                                                비고
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-light lg:text-lg lg:font-normal">
                                        {s.values?.request?.map((v: any, i: number) => (
                                            <tr key={`request_${i}`} className="border-b border-gray-400">
                                                <td className="grid-table-td">
                                                    <div className="checkboxs_wrap border-none">
                                                        <label className="flex justify-center items-center w-full h-full">
                                                            <input checked={v.checked} value={i} type="checkbox" className="!me-0" onChange={handleRequestDocs} />
                                                        </label>
                                                    </div>
                                                </td>
                                                <td className="grid-table-td">{v.docs_name}</td>
                                                <td className="grid-table-td">
                                                    <div className="inline-flex items-center w-32 px-3">
                                                        <select
                                                            value={v.docs_ea}
                                                            data-index={i}
                                                            onChange={handleRequestEa}
                                                            className={cls(s.errors['docs_ea'] ? 'border-danger' : '', 'form-select')}
                                                        >
                                                            <option value="">선택</option>
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                        </select>
                                                        <div className="ms-3">매</div>
                                                    </div>
                                                </td>
                                                <td className="grid-table-td">{v.price}</td>
                                                <td className="grid-table-td">{v.note}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="txt-desc">
                                    <div>･ 이 외 자료는 직접 방문상담 후 발급이 가능합니다.</div>
                                </div>
                            </div>
                        </div>
                        <div className="subject2 font-bold">발급희망일</div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-14">
                            <div className="reserve-box">
                                <label className="form-label">발급희망일</label>
                                <Datepicker
                                    containerClassName="relative w-full text-gray-700 border border-gray-300 rounded"
                                    useRange={false}
                                    asSingle={true}
                                    inputName="hope_at"
                                    {...attrs.is_mand}
                                    i18n={'ko'}
                                    value={{
                                        startDate: s.values?.hope_at?.startDate || s.values?.hope_at,
                                        endDate: s.values?.hope_at?.endDate || s.values?.hope_at,
                                    }}
                                    onChange={fn.handleChangeDateRange}
                                />
                                <div className="txt-desc normal-text !leading-loose">
                                    <div className="must mt-5">
                                        <span className="me-2">증빙서류 지참후</span>
                                        <input type="text" className="w-20 text-center" value={left(s.values?.hope_at?.startDate, 4)} maxLength={4} readOnly title="년" />
                                        <span className="me-2">년</span>
                                        <input type="text" className="w-20 text-center" value={mid(s.values?.hope_at?.startDate, 5, 7)} maxLength={2} readOnly title="월" />
                                        <span className="me-2">월</span>
                                        <input type="text" className="w-20 text-center" value={right(s.values?.hope_at?.startDate, 2)} maxLength={2} readOnly title="일" />
                                        <span>
                                            일 <br />
                                            원무과(2층)에 내원하시어 수납 후 수령 가능합니다.
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="reserve-box txt-desc normal-text !leading-loose">
                                <div className="must">
                                    제증명 및 서류발급은 온라인 신청 후 <b className="text-point">4일 이후(토/일/공휴일 제외)</b>에 발급 가능하므로 발급희망일을 신청일로부터{' '}
                                    <b className="text-point">4일 이후(토/일/공휴일 제외)</b>로 선택하시기 바랍니다.
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-14">
                            <div className="reserve-box">
                                <label className="form-label">비밀번호</label>
                                <input
                                    type="password"
                                    name="password"
                                    {...attrs.is_mand}
                                    value={s.values?.password || ''}
                                    placeholder="비밀번호를 입력해주세요."
                                    onChange={fn.handleChange}
                                    className={cls(s.errors['password'] ? 'border-danger' : '', 'form-control')}
                                />
                                {s.errors['password'] && <div className="form-error">{s.errors['password']}</div>}
                            </div>
                            <div className="txt-desc normal-text !leading-loose">
                                <div className="must">진행상태 및 기입내용을 확인하기 위한 비밀번호를 설정해 주세요</div>
                            </div>
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

                <section className="site-width padding-y">
                    <div className="">
                        <div className="reserve-button-group grid-cols-3">
                            <div
                                onClick={() => {
                                    goBack();
                                }}
                                className="reserve-btn"
                                style={{ backgroundColor: '#e5e5e5' }}
                            >
                                목록으로
                            </div>
                            <button className="reserve-btn bg-second col-span-2 text-white" disabled={s.submitting}>
                                작성완료
                            </button>
                        </div>
                    </div>
                </section>

                {daumModal && <DaumPost daumModal={daumModal} setDaumModal={setDaumModal} handleCompleteFormSet={handleCompleteFormSet} />}
            </form>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    setContext(ctx);
    const device = getAgentDevice(ctx);

    var request: any = {
        uid: 0,
        password: '',
    };
    var response: any = {};
    try {
        const { data } = await api.post(`/be/reserve/docs/read`, request);
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

export default Medical_3_reg;
