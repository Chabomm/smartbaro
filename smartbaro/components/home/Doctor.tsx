import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

import { cls } from '@/libs/utils';
import { Autoplay } from 'swiper';

export default function Doctor({ data, pagination, go_next_page, device }: any) {
    const router = useRouter();
    const [swiper, setSwiper] = useState<any>();
    const [doctorEnd, setDoctorEnd] = useState<boolean>(false);
    const [doctorFirst, setDoctorFirst] = useState<boolean>(false);

    useEffect(() => {
        setDoctorEnd(false);
        setDoctorFirst(false);
    }, [data]);

    return (
        <div>
            <section className="medical_staff" style={{ backgroundImage: `url(/resource/images/main/desktop/main_bg-1.png)` }}>
                <div className="site-width">
                    <div className="main_sub_tit pb-2.5">MEDICAL STAFF</div>
                    <div className="subject pb-18">
                        <span className="font-normal">국제바로병원</span> 의료진 소개
                    </div>
                    <div className="relative">
                        <Swiper
                            modules={[Autoplay]}
                            autoplay={{
                                delay: 1000,
                                disableOnInteraction: false,
                            }}
                            speed={1000}
                            loopedSlides={3}
                            loop={true}
                            centeredSlides={device == 'desktop' ? false : true}
                            spaceBetween={20}
                            slidesPerView={device == 'desktop' ? 4 : 'auto'}
                            onBeforeInit={swipper => setSwiper(swipper)}
                            onSlideChange={e => {
                                e.isEnd ? setDoctorEnd(true) : setDoctorEnd(false);
                                e.isBeginning ? setDoctorFirst(true) : setDoctorFirst(false);
                            }}
                            className="doctor_swiper"
                        >
                            <ul>
                                {data.MAIN_DOCTOR_LIST?.map((v: any, i: number) => (
                                    <li key={i}>
                                        <SwiperSlide className="" style={device == 'desktop' ? {} : { width: '225px' }}>
                                            <div className="card_box">
                                                <div className="doctor-item">
                                                    <div className="text-center">
                                                        <div
                                                            className="img-con cursor-pointer"
                                                            onClick={e => {
                                                                go_next_page(`/company/4/detail/${v.uid}`);
                                                            }}
                                                        >
                                                            <img src={v.profile} alt="" className="w-full mx-auto" />
                                                        </div>
                                                        <div className="text-center relative">
                                                            <div className={cls('text-second', device == 'desktop' ? '' : 'text-sm')}>{v.cate_name}</div>
                                                            <div className={cls('text-bar', device == 'desktop' ? 'text-2xl' : 'text-lg')}>
                                                                <b>{v.name}</b> {v.position}
                                                            </div>
                                                            <div className="py-5 px-2">
                                                                <div className="text-sm line-hidden-3 text-zinc-500">{v.field_keyword}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={e => {
                                                            go_next_page(`/company/4/detail/${v.uid}`);
                                                        }}
                                                        className={cls(
                                                            'bg-second text-white font-semibold w-full py-2.5 flex items-center justify-center',
                                                            device == 'desktop' ? 'text-lg' : 'text-sm'
                                                        )}
                                                    >
                                                        프로필 보기
                                                        <i className="fas fa-chevron-right ms-2 text-sm"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    </li>
                                ))}
                            </ul>
                        </Swiper>
                        <div onClick={() => swiper?.slidePrev()} className="swiper_button_wrap swiper_button_prev main_swiper_prev">
                            <button disabled={doctorFirst} className={cls(doctorFirst ? 'swiper_slide_fin' : '')}></button>
                        </div>
                        <div onClick={() => swiper?.slideNext()} className="swiper_button_wrap swiper_button_next main_swiper_next">
                            <button disabled={doctorEnd} className={cls(doctorEnd ? 'swiper_slide_fin' : '')}></button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
