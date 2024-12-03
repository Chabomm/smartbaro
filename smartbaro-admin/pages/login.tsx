import { NextPage } from 'next';
import React from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
const LottieLogin = dynamic(() => import('@/components/resource/lottie/Login'), { ssr: false });

import SvgLeftTop from '@/components/resource/svg/lefttop';
import SvgRightBottom from '@/components/resource/svg/rightbottom';
import useForm from '@/components/form/useForm';
import { api } from '@/libs/axios';

const Lgoin: NextPage = (props: any) => {
    const router = useRouter();
    let { redirect } = router.query;

    const { s, fn } = useForm({
        initialValues: {},
        onSubmit: async () => {
            await signin(s.values);
        },
    });

    const signin = async (p: any) => {
        try {
            const { data } = await api.post(`/be/admin/signin`, {
                user_id: p.user_id,
                user_pw: p.user_pw,
            });

            if (data.msg != '') {
                alert(data.msg);
            } else if (data.code == 200) {
                localStorage.setItem('admin_menus', JSON.stringify(data.admin_menus));
                if (typeof redirect === 'undefined' || redirect === '') {
                    redirect = '/';
                }
                router.push(redirect + '');
            } else {
                alert(data.msg);
                s.setSubmitting(false);
                return;
            }
        } catch (e: any) {
            console.log(e);
            alert('오류가 발생하였습니다. 관리자에게 문의해주세요');
        }
    };

    const attr_is_mand = {
        is_mand: 'true',
    };

    return (
        <>
            <div className="h-screen overflow-hidden flex items-center justify-center" style={{ background: '#edf2f7' }}>
                <div className="bg-white relative lg:py-20">
                    <div className="flex flex-col items-center justify-between xl:px-5 lg:flex-row">
                        <div className="flex flex-col items-center w-full pt-5 px-5 pb-20 lg:px-10 lg:pt-20 lg:flex-row">
                            <div className="w-full bg-cover relative max-w-md lg:max-w-2xl lg:w-7/12">
                                <div className="flex flex-col items-center justify-center w-full h-full relative lg:pr-10">
                                    <LottieLogin />
                                </div>
                            </div>
                            <div className="w-full mt-20 mr-0 mb-0 ml-0 relative z-10 max-w-2xl lg:mt-0 lg:w-5/12">
                                <div className="flex flex-col items-start justify-start p-5 lg:p-10 bg-white shadow-2xl rounded-xl relative z-10">
                                    <p className="w-full text-4xl font-medium text-center leading-snug font-serif">Sign up for an account</p>

                                    <form method="post" onSubmit={fn.handleSubmit} noValidate className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                                        <div className="relative">
                                            <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">UserId</p>
                                            <input
                                                id="user_id"
                                                name="user_id"
                                                value={s.values?.user_id}
                                                onChange={fn.handleChange}
                                                {...attr_is_mand}
                                                placeholder="아이디를 입력해 주세요"
                                                type="text"
                                                className="border placeholder-gray-400 focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white border-gray-300 rounded-md"
                                            />
                                            {s.errors['user_id'] && <p className="text-red-500 text-xs italic mb-3 ">{s.errors['user_id']}</p>}
                                        </div>
                                        <div className="relative">
                                            <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">Password</p>
                                            <input
                                                id="user_pw"
                                                name="user_pw"
                                                value={s.values?.user_pw}
                                                onChange={fn.handleChange}
                                                {...attr_is_mand}
                                                placeholder="비밀번호를 입력해 주세요"
                                                type="password"
                                                className="border placeholder-gray-400 focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white border-gray-300 rounded-md"
                                            />
                                            {s.errors['user_pw'] && <p className="text-red-500 text-xs italic mb-3 ">{s.errors['user_pw']}</p>}
                                        </div>
                                        <div className="relative">
                                            <button
                                                disabled={s.submitting}
                                                className=" disabled:bg-gray-600 w-full inline-block pt-4 pr-5 pb-4 pl-5 text-xl font-medium text-center text-white bg-indigo-500 rounded-lg transition duration-200 hover:bg-indigo-600 ease"
                                            >
                                                로그인
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <SvgLeftTop className="absolute top-0 left-0 z-0 w-32 h-32 -mt-12 -ml-12 text-yellow-300 fill-current" />
                                <SvgRightBottom className="absolute bottom-0 right-0 z-0 w-32 h-32 -mb-12 -mr-12 text-indigo-500 fill-current" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Lgoin;
