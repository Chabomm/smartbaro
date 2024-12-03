import React, { useState, useEffect } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import Datepicker from 'react-tailwindcss-datepicker';
import Link from 'next/link';

// [ S ] react-datepicker
import DatePicker from 'react-datepicker';
import ko from 'date-fns/locale/ko';
import { subDays, getDay, format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
// [ E ] react-datepicker

import { api, setContext } from '@/libs/axios';
import Breadcrumb from '@/components/Breadcrumb';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import Seo from '@/components/Seo';
import useForm from '@/components/form/useForm';
import { cls, checkNumeric, getAgentDevice, staticReplace } from '@/libs/utils';
import DaumPost from '@/components/UIcomponent/DaumPost';
import { useRouter } from 'next/router';

const Medical_2: NextPage = (props: any) => {
    const router = useRouter();
    const nav_id = '/medical/2';
    const nav_name = '진료예약';
    const page_header = { nav_id: nav_id, sub_title: nav_name };

    const [daumModal, setDaumModal] = useState(false);
    const [posts, setPosts] = useState<any>([]);
    const [doctor, setDoctor] = useState<any>([]);

    useEffect(() => {
        if (JSON.stringify(props) !== '{}') {
            setPosts(props.response);
            s.setValues(props.response.values);
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

            if (params.birth?.startDate == undefined || params.birth?.startDate == '') {
                alert('생년월일을 입력해주세요');
                const el = document.querySelector("input[name='birth']");
                (el as HTMLElement)?.focus();
                s.setSubmitting(false);
                return;
            }

            if (params.rev_date == undefined || params.rev_date == '') {
                alert('진료 희망일을 선택해주세요');
                const el = document.querySelector("input[name='rev_date']");
                (el as HTMLElement)?.focus();
                s.setSubmitting(false);
                return;
            } else {
                params.rev_date = format(params.rev_date, 'yyyy-MM-dd');
            }

            if (params.rev_time == undefined || params.rev_time == '') {
                alert('진료 희망시간을 선택해주세요');
                const el = document.querySelector("input[name='rev_time']");
                (el as HTMLElement)?.focus();
                s.setSubmitting(false);
                return;
            }

            if (!params.is_agree || params.is_agree == null) {
                alert('개인정보 수집, 이용에 동의해주세요');
                const el = document.querySelector("input[name='is_agree']");
                (el as HTMLElement)?.focus();
                s.setSubmitting(false);
                return;
            }
            params.birth = params.birth.startDate;

            const { data } = await api.post(`/be/reserve/edit`, params);
            if (data.code == 200) {
                alert(data.msg);
                router.reload();
                return;
            } else {
                alert(data.msg);
                return;
            }
        } catch (e: any) {}
    };

    // 주소 모달에서 선택 후
    const handleCompleteFormSet = (data: any) => {
        s.values.post = data.zonecode;
        s.values.addr = data.roadAddress;
        const el = document.querySelector("input[name='addr_detail']");
        (el as HTMLElement)?.focus();
    };

    const getDoctor = (cate_uid: number) => {
        const doctor_list: any = [];
        props.response.doctor_list.forEach(function (v: any, i: any) {
            if (v.cate_uid.includes(checkNumeric(cate_uid))) {
                doctor_list.push(v);
            }
        });
        setDoctor(doctor_list);
    };

    const handleChangeCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const copy = { ...s.values };
        copy.cate_uid = value;
        copy.doctor_uid = 0;
        copy.rev_date = '';
        copy.rev_time = '';
        s.setValues(copy);
    };

    const [initDate, setInitDate] = useState<any>(null);
    const [amdisabled, setAmdisabled] = useState<any>(false);
    const [pmdisabled, setPmdisabled] = useState<any>(false);

    const handleChangeDoctor = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const { name, value, checked } = e.target;
            const copy = { ...s.values };
            copy.doctor_uid = checkNumeric(value);
            copy.rev_date = '';
            copy.rev_time = '';
            s.setValues(copy);

            setAmdisabled(false);
            setPmdisabled(false);

            const { data } = await api.post(`/be/doctor/schedule/read`, { uid: value });
            const params = { ...posts };
            params.schedule = data;
            setPosts(params);

            setInitDate(null);
        } catch (e: any) {}
    };

    const handleChangeRevDate = async (newValue: any, name: string) => {
        s.setValues({ ...s.values, [name]: newValue });

        const copy = { ...s.values };
        copy.rev_date = newValue;
        copy.rev_time = '';

        const day = getDay(new Date(copy.rev_date));
        setAmdisabled(false);
        setPmdisabled(false);
        if (copy.doctor_uid > 0 && checkNumeric(posts.schedule.uid) > 0) {
            if (posts.schedule['am_week_' + day] == '수술') {
                setAmdisabled(true);
            }

            if (posts.schedule['pm_week_' + day] == '수술') {
                setPmdisabled(true);
            }
        }

        setInitDate(new Date(copy.rev_date));
        s.setValues(copy);
    };

    const filterDisableDate = date => {
        const day = getDay(date);

        // day == 0 : 일요일
        // day == 1 : 월요일
        // ...
        // day == 6 : 토요일

        if (day == 0 || day == 6) return false;

        if (s.values.doctor_uid > 0 && checkNumeric(posts.schedule.uid) > 0) {
            if (posts.schedule['am_week_' + day] == '수술' && posts.schedule['pm_week_' + day] == '수술') {
                return false;
            }
        }

        return true;
    };

    return (
        <Layout title={nav_name} nav_id={nav_id} device={props.device}>
            <Seo title={nav_name} />
            <PageHeader params={page_header} device={props.device} />
            <Breadcrumb nav_id={nav_id} device={props.device} />

            <div className="subject sub-py">진료 예약</div>
            <form onSubmit={fn.handleSubmit} noValidate>
                <section className="site-width reserve-wrap">
                    <div className="site-width reserve-item">
                        <div className="subject2 font-bold !pt-0">예약자 정보</div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-9 normal-text">
                            <div>
                                <div className="reserve-box">
                                    <label className="form-label">환자 이름</label>
                                    <input
                                        type="text"
                                        name="user_name"
                                        {...attrs.is_mand}
                                        value={s.values?.user_name || ''}
                                        placeholder="환자 이름을 입력해주세요."
                                        onChange={fn.handleChange}
                                        className={cls(s.errors['user_name'] ? 'border-danger' : '', 'form-control')}
                                    />
                                    {s.errors['user_name'] && <div className="form-error">{s.errors['user_name']}</div>}
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
                            </div>
                            <div>
                                <div className="reserve-box">
                                    <label className="form-label">생년월일</label>
                                    <Datepicker
                                        containerClassName="relative w-full text-gray-700 border border-gray-300 rounded"
                                        useRange={false}
                                        asSingle={true}
                                        inputName="birth"
                                        {...attrs.is_mand}
                                        i18n={'ko'}
                                        value={{
                                            startDate: s.values?.birth?.startDate || s.values?.birth,
                                            endDate: s.values?.birth?.endDate || s.values?.birth,
                                        }}
                                        onChange={fn.handleChangeDateRange}
                                    />
                                </div>
                                <div className="reserve-box">
                                    <label className="form-label">성별</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <input type="radio" name="gender" id="gender_m" value="남" className="peer hidden" onChange={fn.handleChange} />
                                            <label htmlFor="gender_m" className="form-radio peer-checked:bg-second peer-checked:text-white">
                                                남자
                                            </label>
                                        </div>

                                        <div>
                                            <input type="radio" name="gender" id="gender_w" value="여" className="peer hidden" onChange={fn.handleChange} />
                                            <label htmlFor="gender_w" className="form-radio peer-checked:bg-second peer-checked:text-white">
                                                여자
                                            </label>
                                        </div>
                                    </div>
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
                                            setDaumModal(true);
                                        }}
                                        className={cls(s.errors['post'] ? 'border-danger' : '', 'form-control col-span-3')}
                                        placeholder="우편번호"
                                        readOnly
                                    />
                                    <button
                                        className="col-span-2 search-btn"
                                        type="button"
                                        onClick={() => {
                                            setDaumModal(true);
                                        }}
                                    >
                                        우편번호 검색
                                    </button>
                                </div>
                                {s.errors['post'] && <div className="form-error">{s.errors['post']}</div>}
                                <input
                                    type="text"
                                    name="addr"
                                    value={s.values?.addr || ''}
                                    onChange={fn.handleChange}
                                    {...attrs.is_mand}
                                    className={cls(s.errors['addr'] ? 'border-danger' : '', 'form-control mb-2.5')}
                                    placeholder=""
                                    readOnly
                                />
                                {s.errors['addr'] && <div className="form-error">{s.errors['addr']}</div>}
                                <input
                                    type="text"
                                    name="addr_detail"
                                    {...attrs.is_mand}
                                    value={s.values?.addr_detail || ''}
                                    placeholder="상세위치 입력 (예:○○빌딩 2층)"
                                    onChange={fn.handleChange}
                                    className={cls(s.errors['addr_detail'] ? 'border-danger' : '', 'form-control')}
                                />
                                {s.errors['addr_detail'] && <div className="form-error">{s.errors['addr_detail']}</div>}
                            </div>
                        </div>
                        <div className="txt-desc">
                            <div>
                                ･ 온라인 예약은 <b className="text-point">실시간 예약이 아니며, 전문상담원과 상담 후 예약 확정</b>됩니다.
                            </div>
                            <div>･ 전화상담은 평일 09:00~18:00, 토요일 09:00~13:00 이루어집니다. (점심시간 13:00 ~ 14:00 / 일요일 및 공휴일은 휴진)</div>
                        </div>
                    </div>
                </section>

                <section className="site-width reserve-wrap">
                    <div className="site-width reserve-item">
                        <div className="subject2 font-bold !pt-0">진료내용 및 의료진 선택</div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-9 normal-text">
                            <div>
                                <div className="reserve-box">
                                    <label className="form-label">진료 구분</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <input type="radio" name="is_first" onChange={fn.handleChange} id="is_first_T" value="초진" className="peer hidden" />
                                            <label htmlFor="is_first_T" className="form-radio peer-checked:bg-second peer-checked:text-white">
                                                초진
                                            </label>
                                        </div>
                                        <div>
                                            <input type="radio" name="is_first" onChange={fn.handleChange} id="is_first_F" value="재진" className="peer hidden" />
                                            <label htmlFor="is_first_F" className="form-radio peer-checked:bg-second peer-checked:text-white">
                                                재진
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="reserve-box">
                                    <label className="form-label">진료과 선택</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {posts.category_list?.map(
                                            (v, i) =>
                                                v.is_reserve == 'T' && (
                                                    <div key={i}>
                                                        <input
                                                            id={`cate_uid-${i}`}
                                                            checked={checkNumeric(s.values.cate_uid) == checkNumeric(v.uid) ? true : false}
                                                            type="radio"
                                                            value={checkNumeric(v.uid)}
                                                            name="cate_uid"
                                                            className="peer hidden"
                                                            onChange={handleChangeCategory}
                                                            onClick={() => {
                                                                getDoctor(checkNumeric(v.uid));
                                                            }}
                                                        />
                                                        <label htmlFor={`cate_uid-${i}`} className="form-radio cate-item peer-checked:bg-second peer-checked:text-white">
                                                            <div>
                                                                <img src={v.cate_icon} alt="" className="mx-auto w-full peer-checked:border peer-checked:rounded-full " />
                                                            </div>
                                                            <div className="cate-name">{v.cate_name}</div>
                                                        </label>
                                                    </div>
                                                )
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="reserve-box">
                                    <label className="form-label">의료진 선택</label>
                                    {doctor.length == 0 && <div>진료과를 선택해주세요</div>}
                                    {doctor?.map((v, i) => (
                                        <div key={i} className="p-5 border mb-2.5">
                                            <div className="flex">
                                                <div className="flex-none" style={{ width: '85px' }}>
                                                    <img src={v.profile} alt="" className="w-full" />
                                                </div>
                                                <div className="flex-1 ms-5">
                                                    <div className="text-base font-medium">
                                                        <b className="text-xl">{v.name}</b> {v.position}
                                                    </div>
                                                    <div className="text-sm">전문분야</div>
                                                    <div className="text-base font-medium line-hidden-1">{v.field_keyword}</div>
                                                    <div className="">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {/* <button
                                                                type="button"
                                                                className="border bg-zinc-500 text-sm text-white font-bold peer-checked:bg-second"
                                                                onClick={() => {
                                                                    getDoctorSchedule(`${v.uid}`);
                                                                }}
                                                            >
                                                                의료진 선택
                                                            </button> */}

                                                            <input
                                                                type="radio"
                                                                name="doctor_uid"
                                                                onChange={handleChangeDoctor}
                                                                id={`doctor_uid-${i}`}
                                                                value={v.uid}
                                                                checked={s.values.doctor_uid == v.uid ? true : false}
                                                                className="peer hidden"
                                                            />
                                                            <label
                                                                htmlFor={`doctor_uid-${i}`}
                                                                className="form-radio peer-checked:bg-second peer-checked:text-white !text-sm !py-1 bg-zinc-500 text-white !border-0"
                                                            >
                                                                의료진 선택
                                                            </label>

                                                            <button type="button" className="border border-second text-sm text-second font-bold py-1">
                                                                <Link href={`/company/4/detail/${v.uid}`} target="_blank">
                                                                    의료진 정보
                                                                </Link>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="reserve-box">
                                    <label className="form-label">진료 희망일</label>
                                    {checkNumeric(posts.schedule?.uid) == 0 && <div>진료과 및 의료진을 선택해주세요</div>}
                                    <DatePicker
                                        selected={s.values.rev_date}
                                        // onChange={date => handleChangeRevDate(format(date, 'yyyy-MM-dd'), 'rev_date')}
                                        onChange={date => handleChangeRevDate(date, 'rev_date')}
                                        locale={ko}
                                        minDate={subDays(new Date(), -1)}
                                        calendarClassName={cls('date-picker-calendar', checkNumeric(posts.schedule?.uid) > 0 ? '' : '!hidden')}
                                        // calendarClassName={cls('date-picker-calendar')}
                                        inline
                                        filterDate={filterDisableDate}
                                        renderCustomHeader={({
                                            // custom header 만들어주기
                                            date,
                                            decreaseMonth,
                                            increaseMonth,
                                            prevMonthButtonDisabled,
                                            nextMonthButtonDisabled,
                                        }) => (
                                            <div className="custom-header">
                                                <button type="button" onClick={() => decreaseMonth()} disabled={prevMonthButtonDisabled}>
                                                    <i className="fas fa-chevron-circle-left "></i>
                                                </button>
                                                <div>
                                                    {date.getFullYear()}년 {date.getMonth() + 1}월
                                                </div>
                                                <button type="button" onClick={() => increaseMonth()} disabled={nextMonthButtonDisabled}>
                                                    <i className="fas fa-chevron-circle-right"></i>
                                                </button>
                                            </div>
                                        )}
                                    />
                                </div>

                                {s.values.rev_date != '' && (
                                    <div className="reserve-box">
                                        <label className="form-label">예약 희망시간</label>
                                        {checkNumeric(posts.schedule?.uid) == 0 && <div>진료과 및 의료진을 선택해주세요</div>}
                                        <div className="grid grid-cols-3 gap-2">
                                            {posts.schedule?.times_am?.map((v, i) => (
                                                <div key={i}>
                                                    <input
                                                        id={'time_am_' + i}
                                                        type="radio"
                                                        name="rev_time"
                                                        checked={s.values.rev_time == v ? true : false}
                                                        value={v}
                                                        onChange={fn.handleChange}
                                                        disabled={amdisabled}
                                                        className="peer hidden"
                                                    />
                                                    <label
                                                        htmlFor={'time_am_' + i}
                                                        className="form-radio peer-checked:bg-second peer-checked:text-white peer-disabled:text-gray-300"
                                                    >
                                                        {v}
                                                    </label>
                                                </div>
                                            ))}
                                            {posts.schedule?.times_pm?.map((v, i) => (
                                                <div key={i}>
                                                    <input
                                                        id={'time_pm_' + i}
                                                        type="radio"
                                                        name="rev_time"
                                                        checked={s.values.rev_time == v ? true : false}
                                                        value={v}
                                                        onChange={fn.handleChange}
                                                        disabled={pmdisabled}
                                                        className="peer hidden"
                                                    />
                                                    <label
                                                        htmlFor={'time_pm_' + i}
                                                        className="form-radio peer-checked:bg-second peer-checked:text-white peer-disabled:text-gray-300"
                                                    >
                                                        {v}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
                        <div className="reserve-button-group grid-cols-2">
                            <div className="reserve-btn" style={{ backgroundColor: '#e5e5e5' }}>
                                취소
                            </div>
                            <button className="reserve-btn bg-second text-white" disabled={s.submitting}>
                                예약접수
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
    };

    var response: any = {};
    try {
        const { data } = await api.post(`/be/doctor/list`, request);
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

export default Medical_2;
