import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import { Pagination, Autoplay } from 'swiper';
import { cls } from '@/libs/utils';

export default function Qook({ data, pagination, go_next_page, device }: any) {
    const router = useRouter();
    const [swiper, setSwiper] = useState<any>();
    const [buttonEnd, setButtonEnd] = useState<boolean>(false);
    const [buttonFirst, setButtonFirst] = useState<boolean>(false);

    useEffect(() => {
        setButtonEnd(false);
        setButtonFirst(false);
    }, [data]);

    const go_more_page = () => {
        sessionStorage.setItem(
            router.asPath,
            JSON.stringify({
                data: data,
                scroll_x: `${window.scrollX}`,
                scroll_y: `${window.scrollY}`,
            })
        );
        router.push(`/bbs/qooktv`);
    };
    return (
        <div>
            <section className={cls('bg-section-gray', device == 'desktop' ? '' : '!px-0')}>
                <div className="site-width padding-y text-center qook-wrap">
                    <div className="main_sub_tit pb-2.5">MEDIA CENTER</div>
                    <div className="subject pb-14">
                        <span className="font-normal">국제바로병원</span> 쿡TV
                    </div>
                    <div className="relative">
                        <Swiper
                            modules={[Pagination, Autoplay]}
                            initialSlide={device == 'desktop' ? 0 : 2} // 시작위치값
                            centeredSlides={device == 'desktop' ? false : true}
                            autoplay={{
                                delay: 2000,
                                disableOnInteraction: false,
                            }}
                            loop={true}
                            speed={1000}
                            slidesPerView={device == 'desktop' ? 3 : 'auto'}
                            pagination={pagination}
                            spaceBetween={20}
                            onBeforeInit={swipper => setSwiper(swipper)}
                            onSlideChange={e => {
                                e.isEnd ? setButtonEnd(true) : setButtonEnd(false);
                                e.isBeginning ? setButtonFirst(true) : setButtonFirst(false);
                            }}
                            className="qook_banner"
                        >
                            {data?.QOOK_TV_LIST?.map((v: any, i: number) => (
                                <SwiperSlide key={i} style={device == 'desktop' ? {} : { width: '300px' }}>
                                    <div className="pt-0">
                                        <div
                                            className="overflow-hidden mb-2"
                                            onClick={e => {
                                                go_next_page(`/bbs/view/${v.uid}`);
                                            }}
                                        >
                                            <img alt="" className="w-full" src={v.thumb} />
                                        </div>
                                        <div className="border-point second-bar border-l-2 font-bold text-start pl-3.5">{v.title}</div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <div onClick={() => swiper?.slidePrev()} className="swiper_button_wrap swiper_button_prev main_swiper_prev">
                            <button disabled={buttonFirst} className={cls(buttonFirst ? 'swiper_slide_fin' : '')}></button>
                        </div>
                        <div onClick={() => swiper?.slideNext()} className="swiper_button_wrap swiper_button_next main_swiper_next">
                            <button disabled={buttonEnd} className={cls(buttonEnd ? 'swiper_slide_fin' : '')}></button>
                        </div>
                        <button
                            type="button"
                            className=""
                            onClick={e => {
                                go_next_page('/bbs/qooktv');
                            }}
                        >
                            <div className="border border-black py-2 px-8 mt-10 inline-flex text-sm">
                                더보기
                                <div>
                                    <img src="/resource/images/main/desktop/more_icon.png" alt="" className="inline-block ms-4" />
                                </div>
                            </div>
                        </button>
                    </div>
                    {/* {desktop ? (
                        <div>
                            <div className="grid grid-cols-4 gap-5">
                                {data.QOOK_TV_LIST?.map((v, i) => (
                                    <div
                                        key={i}
                                        className="cursor-pointer"
                                        onClick={e => {
                                            go_next_page(`/bbs/view/${v.uid}`);
                                        }}
                                    >
                                        <div className="overflow-hidden inline-block mb-2">
                                            <img alt="" className="object-cover object-center w-full transition hover:duration-500 hover:scale-125" src={v.thumb} />
                                        </div>
                                        <div className="border-point second-bar border-l-2 font-bold text-start pl-3.5">{v.title}</div>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                className=""
                                onClick={e => {
                                    go_next_page('/bbs/qooktv');
                                }}
                            >
                                <div className="border border-black mt-16 px-16 py-2 inline-flex ">
                                    더보기
                                    <div>
                                        <img src="/resource/images/main/desktop/more_icon.png" alt="" className="inline-block ms-4" />
                                    </div>
                                </div>
                            </button>
                        </div>
                    ) : (
                        <div>
                            <Swiper modules={[Pagination]} pagination={pagination} spaceBetween={20} centeredSlides={true} className="qook_banner">
                                {data?.QOOK_TV_LIST?.map((v: any, i: number) => (
                                    <SwiperSlide key={i}>
                                        <div className="p-4 pt-0">
                                            <div className="overflow-hidden mb-2">
                                                <img alt="" className="w-full" src={v.thumb} />
                                            </div>
                                            <div className="border-point second-bar border-l-2 font-bold text-start pl-3.5">{v.title}</div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <button
                                type="button"
                                className=""
                                onClick={e => {
                                    go_next_page('/bbs/qooktv');
                                }}
                            >
                                <div className="border border-black py-2 px-8 mt-10 inline-flex text-sm">
                                    더보기
                                    <div>
                                        <img src="/resource/images/main/desktop/more_icon.png" alt="" className="inline-block ms-4" />
                                    </div>
                                </div>
                            </button>
                        </div>
                    )} */}
                </div>
            </section>
        </div>
    );
}
