import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import { cls } from '@/libs/utils';

export default function Media({ data, pagination, go_next_page, device }: any) {
    const [swiper, setSwiper] = useState<any>();
    const [doctorEnd, setDoctorEnd] = useState<boolean>(false);
    const [doctorFirst, setDoctorFirst] = useState<boolean>(false);

    useEffect(() => {
        setDoctorEnd(false);
        setDoctorFirst(false);
    }, [data]);

    return (
        <div>
            <section className={cls('bg-section-gray', device == 'desktop' ? '' : '!px-0')}>
                <div className="site-width padding-y media_wrap">
                    <div className="main_sub_tit pb-2.5">JOURNAL</div>
                    <div className="subject pb-14">
                        <span className="font-normal">국제바로병원</span> 언론 보도
                    </div>
                    <div className={cls('relative', device == 'desktop' ? 'px-24' : '')}>
                        <Swiper
                            modules={[Autoplay]}
                            initialSlide={device == 'desktop' ? 0 : 2} // 시작위치값
                            centeredSlides={device == 'desktop' ? false : true}
                            autoplay={{
                                delay: 2000,
                                disableOnInteraction: false,
                            }}
                            speed={1000}
                            slidesPerView={device == 'desktop' ? 3 : 'auto'}
                            spaceBetween={20}
                            loop={true}
                            onBeforeInit={swipper => setSwiper(swipper)}
                            onSlideChange={e => {
                                e.isEnd ? setDoctorEnd(true) : setDoctorEnd(false);
                                e.isBeginning ? setDoctorFirst(true) : setDoctorFirst(false);
                            }}
                            className="media_swiper"
                        >
                            {data.MEDIA_LIST?.map((v: any, i: number) => (
                                <SwiperSlide key={i} style={device == 'desktop' ? {} : { width: '280px' }}>
                                    <div className="card_box !m-0">
                                        <div className="relative">
                                            <button
                                                onClick={e => {
                                                    go_next_page(`/bbs/view/${v.uid}`);
                                                }}
                                                className="w-full"
                                            >
                                                <img src={v.thumb} alt="" className="mx-auto" />
                                            </button>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
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
