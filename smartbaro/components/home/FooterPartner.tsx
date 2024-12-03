import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import { Navigation, Autoplay } from 'swiper';

export default function FooterPartner({ data, device }: any) {
    return (
        <div>
            <section className="site-width py-5">
                <div className="">
                    <Swiper
                        spaceBetween={20}
                        // initialSlide={1}
                        slidesPerView={device == 'desktop' ? 5 : 3}
                        mousewheel={true}
                        allowTouchMove={false}
                        loop={true}
                        loopedSlides={3}
                        modules={[Navigation, Autoplay]}
                        autoplay={{
                            delay: 0,
                            disableOnInteraction: false,
                        }}
                        speed={2000}
                        className="smooth_wrapper"
                    >
                        {data.FOOTER_PARTNER_LIST?.map((v: any, i: number) => (
                            <SwiperSlide key={i}>
                                <img src={v.banner_src} alt="" className="inline-block" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>
        </div>
    );
}
