import { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper';
import { cls } from '@/libs/utils';

export default function MainBanner({ data, go_next_page, device }: any) {
    const swiperRef = useRef<SwiperRef>(null);

    const [swiperPlay, setSwiperPlay] = useState<boolean>(true);
    const [slideActive, setSlideActive] = useState<number>(0);
    const [slideTotal, setSlideTotal] = useState<number>(0);

    // Bullet
    const pagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + '</span>';
        },
    };

    const swiperPlayStop = () => {
        const swiper_current = swiperRef.current;
        if (swiperPlay) {
            if (swiper_current != null) {
                swiper_current.swiper?.autoplay?.stop();
                setSwiperPlay(false);
            }
        } else {
            if (swiper_current != null) {
                swiper_current.swiper?.autoplay?.start();
                setSwiperPlay(true);
            }
        }
    };

    // const swiperStop = () => {
    //     console.log('swiper stop..');
    //     const swiper_current = swiperRef.current;
    //     if (swiper_current != null) {
    //         swiper_current.swiper?.autoplay?.stop();
    //     }
    // };
    // const swiperPlay = () => {
    //     const swiper_current = swiperRef.current;
    //     if (swiper_current != null) {
    //         swiper_current.swiper?.autoplay?.start();
    //     }
    // };

    return (
        <div className="main_banner relative">
            <Swiper
                ref={swiperRef}
                modules={[Pagination, Autoplay]}
                centeredSlides={true}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                speed={1000}
                loop={true}
                onSlideChange={swiper => {
                    setSlideActive(swiper.realIndex + 1);
                    setSlideTotal(data?.MAIN_BANNER_LIST.length);
                }}
            >
                {data?.MAIN_BANNER_LIST?.map((v: any, i: number) => (
                    <SwiperSlide key={`MAIN_BANNER_LIST_${i}`}>
                        <div className="main_banner_area_temp" style={{ backgroundImage: `url(${v.banner_src})` }}></div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="swiper-stop-play flex text-xl">
                <button type="button" onClick={swiperPlayStop}>
                    <i className={cls(`far fa-${swiperPlay ? 'pause' : 'play'}-circle`)}></i>
                </button>
                <div className="ms-2 font-semibold">
                    {slideActive} / {slideTotal}
                </div>
            </div>
        </div>
    );
}
