import type { GetServerSideProps } from 'next';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Breadcrumb from '@/components/Breadcrumb';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import Seo from '@/components/Seo';
import { getAgentDevice } from '@/libs/utils';
import { api, setContext } from '@/libs/axios';

export default function Medical_3_view(props: any) {
    const router = useRouter();
    const nav_id = '/medical/3';
    const nav_name = '제증명서류발급';
    const page_header = { nav_id: nav_id, sub_title: nav_name };

    const [posts, setPosts] = useState(props?.response);
    const [secretVaild, setSecretVaild] = useState(false);

    useEffect(() => {
        if (typeof props.response.code === 'undefined' || props.response.code == '') {
            setSecretVaild(false);
        } else if (props.response.msg != '') {
            alert(props.response.msg);
            setSecretVaild(false);
        } else if (props.response.code == 200) {
            if (props.response.uid > 0) {
                setSecretVaild(true);
            }
        }
    }, [props]);

    function goBack() {
        // router.back();
        router.push('/medical/3/list');
    }

    return (
        <Layout title={nav_name} nav_id={nav_id} device={props.device}>
            <Seo title={nav_name} />
            <PageHeader params={page_header} device={props.device} />
            <Breadcrumb nav_id={nav_id} device={props.device} />

            <div className="subject sub-py">제증명서류발급</div>

            {secretVaild ? (
                <div>
                    <section className="site-width reserve-wrap">
                        <div className="site-width reserve-item">
                            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-9 normal-text">
                                <div>
                                    <div className="reserve-box">
                                        <label className="form-label">상태</label>
                                        <input type="text" className="form-control" value={posts?.state} readOnly />
                                    </div>
                                </div>
                                <div>
                                    {posts?.state != '취소' && (
                                        <div className="txt-desc normal-text !leading-loose">
                                            <div className="mt-5">
                                                <span className="me-2">증빙서류 지참후</span>
                                                <span className="font-bold text-2xl text-blue-500">{posts?.issue_at}</span>
                                                <span>
                                                    에 <br />
                                                    원무과(2층)에 내원하시어 수납 후 수령 가능합니다.
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="site-width reserve-wrap">
                        <div className="site-width reserve-item">
                            <div className="subject2 font-bold !pt-0">환자 정보</div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-9 normal-text">
                                <div>
                                    <div className="reserve-box">
                                        <label className="form-label">환자 이름</label>
                                        <input type="text" className="form-control" value={posts?.name} readOnly />
                                    </div>
                                    <div className="reserve-box">
                                        <label className="form-label">전화번호</label>
                                        <input type="text" className="form-control" value={posts?.tel} readOnly />
                                    </div>
                                </div>
                                <div className="reserve-box">
                                    <div className="reserve-box">
                                        <label className="form-label">휴대폰 번호</label>
                                        <input type="text" className="form-control" value={posts?.mobile} readOnly />
                                    </div>
                                    <label className="form-label">주소</label>
                                    <div className="form-control">
                                        ({posts?.post}) {posts?.addr1}
                                    </div>
                                </div>
                            </div>
                            <div className="subject2 font-bold">신청인 정보</div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-9 normal-text">
                                <div>
                                    <div className="reserve-box">
                                        <label className="form-label">이름</label>
                                        <input type="text" className="form-control" value={posts?.proposer} readOnly />
                                    </div>
                                    <div className="reserve-box">
                                        <label className="form-label">전화번호</label>
                                        <input type="text" className="form-control" value={posts?.proposer_tel} readOnly />
                                    </div>
                                </div>
                                <div className="reserve-box">
                                    <div className="reserve-box">
                                        <label className="form-label">휴대폰 번호</label>
                                        <input type="text" className="form-control" value={posts?.proposer_mobile} readOnly />
                                    </div>
                                    <label className="form-label">주소</label>
                                    <div className="form-control">
                                        ({posts?.proposer_post}) {posts?.proposer_addr1}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="site-width reserve-wrap">
                        <div className="site-width reserve-item">
                            <div className="subject2 font-bold !pt-0">신청자별 구비서류</div>
                            <div className="grid grid-cols-1 normal-text">
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
                                                            checked={posts?.relation_type == '환자' ? true : false}
                                                            disabled={posts?.relation_type == '환자' ? false : true}
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
                                                            checked={posts?.relation_type == '친족' ? true : false}
                                                            disabled={posts?.relation_type == '친족' ? false : true}
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
                                                            checked={posts?.relation_type == '지정대리인' ? true : false}
                                                            type="radio"
                                                            value="지정대리인"
                                                            className="w-4 h-4 mx-2"
                                                            disabled={posts?.relation_type == '지정대리인' ? false : true}
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
                            <div className="subject2 font-bold">신청목적</div>
                            <input type="text" className="form-control" value={posts?.purpose_type} readOnly />
                        </div>
                    </section>

                    <section className="site-width reserve-wrap">
                        <div className="site-width reserve-item">
                            <div className="subject2 font-bold !pt-0">제증명 및 서류 요청부분</div>
                            <div className="grid grid-cols-1 normal-text">
                                <div>
                                    <div className="overflow-x-auto">
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

                                            <tbody className="text-lg">
                                                {posts?.request?.map((v: any, i: number) => (
                                                    <tr key={`request_${i}`} className="border-b border-gray-400">
                                                        <td className="grid-table-td">
                                                            <div className="checkboxs_wrap border-none">
                                                                <label className="flex justify-center items-center w-full h-full">
                                                                    <input checked={v.checked} value={i} type="checkbox" className="" disabled />
                                                                </label>
                                                            </div>
                                                        </td>
                                                        <td className="grid-table-td">{v.docs_name}</td>
                                                        <td className="grid-table-td">
                                                            <div className="inline-flex items-center w-32 px-3">
                                                                <select disabled value={v.docs_ea} data-index={i} className="form-select">
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
                                    </div>
                                    <div className="txt-desc">
                                        <div>･ 이 외 자료는 직접 방문상담 후 발급이 가능합니다.</div>
                                    </div>
                                </div>
                            </div>
                            <div className="subject2 font-bold">발급희망일</div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-14">
                                <div className="reserve-box">
                                    <label className="form-label">발급희망일</label>
                                    <input type="text" className="form-control" value={posts?.hope_at} readOnly />
                                </div>
                                <div className="txt-desc normal-text !leading-loose">
                                    <div className="must">
                                        제증명 및 서류발급은 온라인 신청 후 <b className="text-point">4일 이후(토/일/공휴일 제외)</b>에 발급 가능하므로 발급희망일을 신청일로부터{' '}
                                        <b className="text-point">4일 이후(토/일/공휴일 제외)</b>로 선택하시기 바랍니다.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="site-width padding-y">
                        <div className="">
                            <div className="reserve-button-group ">
                                <div
                                    onClick={() => {
                                        goBack();
                                    }}
                                    className="reserve-btn"
                                    style={{ backgroundColor: '#e5e5e5' }}
                                >
                                    목록으로
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            ) : (
                <form method="POST">
                    <div className="site-width">
                        <div>비밀번호를 입력해주세요 :</div>
                        <input type="password" name="password" className="form-control" />
                        <section className="padding-y">
                            <div className="">
                                <div className="button-group grid-cols-2 ">
                                    <div
                                        onClick={() => {
                                            goBack();
                                        }}
                                        className="reserve-btn"
                                        style={{ backgroundColor: '#e5e5e5' }}
                                    >
                                        취소
                                    </div>
                                    <button type="submit" className="reserve-btn  bg-second text-white">
                                        확인
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                </form>
            )}
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
    let postData: any = { password: '' };
    if (ctx.req?.method == 'POST') {
        postData = await new Promise((resolve, reject) => {
            // post data getting ...
            const body: any = [];
            ctx.req?.on('data', (chunk: any) => {
                body.push(chunk);
            });
            ctx.req?.on('end', () => {
                const asString = body.toString();
                const data = JSON.parse('{"' + decodeURI(asString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
                resolve(data);
            });
            ctx.req?.on('error', e => {
                resolve(e);
            });
        });
    }

    setContext(ctx);
    const device = getAgentDevice(ctx);
    var request: any = {
        uid: ctx.query.uid,
        password: postData?.password,
    };
    var response: any = {};

    if (typeof postData.password === 'undefined' || postData.password == '') {
        return {
            // props: { request, response, device: device },
            props: { response, device: device }, // request에 비밀번호가 있어서 제외함
        };
    }

    try {
        const { data } = await api.post(`/be/reserve/docs/read`, request);
        response = data;
    } catch (e: any) {
        if (typeof e.redirect !== 'undefined') {
            return { redirect: e.redirect };
        }
    }
    return {
        props: { request, response, device: device },
    };
};
