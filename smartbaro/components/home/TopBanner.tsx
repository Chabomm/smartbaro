import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { cls } from '@/libs/utils';

export default function TopBanner({ data, nav_id, device }: any) {
    const [open, setOpen] = useState<boolean>(true);
    const [swiper, setSwiper] = useState<any>();
    const [buttonEnd, setButtonEnd] = useState<boolean>(false);
    const [buttonFirst, setButtonFirst] = useState<boolean>(false);

    useEffect(() => {
        if (nav_id != '/') {
            setOpen(false);
        }
    }, [nav_id]);

    const onToggle = () => {
        setOpen(!open);
    };

    useEffect(() => {
        setButtonEnd(false);
        setButtonFirst(false);
    }, [data]);

    return (
        <div className="w-full border-b top_banner bg-slate-50">
            <div className="site-width relative">
                <div
                    className={cls(
                        'top-banner-wrap transition-all flex items-center',
                        open ? 'open h-16 lg:h-24 opacity-100 duration-500' : 'opacity-0 !h-0 duration-500 bottom-96'
                    )}
                >
                    <Swiper
                        className="w-full"
                        slidesPerView={device == 'desktop' ? 2 : 1}
                        onBeforeInit={swipper => setSwiper(swipper)}
                        onSlideChange={e => {
                            e.isEnd ? setButtonEnd(true) : setButtonEnd(false);
                            e.isBeginning ? setButtonFirst(true) : setButtonFirst(false);
                        }}
                    >
                        {data.TOP_BANNER_LIST?.map((v, i) => (
                            <SwiperSlide key={i} className="">
                                <div className={cls(i == 0 ? 'lg:border-r' : '')}>
                                    <div className="flex justify-around items-center">
                                        <Link href={v.link}>
                                            <div className="flex items-center">
                                                <div className="me-2">
                                                    <img src={v.banner_src} alt="" className="me-3 lg:w-16 w-10" />
                                                </div>
                                                <div>
                                                    <div className="normal-text !font-bold !text-zinc-500">{v.txt1}</div>
                                                    <div className="text-xs lg:text-base">{v.txt2}</div>
                                                </div>
                                            </div>
                                        </Link>
                                        <div className="hidden lg:block">
                                            <Link href={v.link} className="rounded-full text-white bg-second text-xs lg:text-sm leading-10 px-3 py-2">
                                                자세히 보기 {'>'}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div onClick={() => swiper?.slidePrev()} className={device == 'desktop' ? 'hidden' : 'swiper_button_wrap swiper_button_prev main_swiper_prev'}>
                        <button disabled={buttonFirst} className={cls(buttonFirst ? 'swiper_slide_fin' : '')}></button>
                    </div>
                    <div onClick={() => swiper?.slideNext()} className={device == 'desktop' ? 'hidden' : 'swiper_button_wrap swiper_button_next main_swiper_next'}>
                        <button disabled={buttonEnd} className={cls(buttonEnd ? 'swiper_slide_fin' : '')}></button>
                    </div>
                </div>

                {/* <div className={cls('grid grid-cols-2 h-24 py-5 ', open ? 'open' : 'hidden')}>
                    {data.TOP_BANNER_LIST?.map((v, i) => (
                        <div className={cls(i == 0 ? 'border-r' : '')}>
                            <div className="flex justify-around items-center">
                                <Link href={v.link}>
                                    <div className="flex items-center">
                                        <div className="me-2">
                                            <img src={v.banner_src} alt="" className="me-3" />
                                        </div>
                                        <div>
                                            <div className="text-xl font-bold text-zinc-500">{v.txt1}</div>
                                            <div>{v.txt2}</div>
                                        </div>
                                    </div>
                                </Link>
                                <div>
                                    <Link href={v.link} className="rounded-full text-white bg-second text-sm leading-10 px-3 py-2">
                                        자세히 보기 {'>'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> */}
                <div className={cls('absolute right-16 -bottom-12 lg:right-0 lg:-bottom-8 h-8 text-black text-xs lg:text-sm')} style={{ zIndex: '111' }}>
                    <div className="lg:border px-3 py-1 lg:py-2 cursor-pointer lg:bg-slate-50 lg:rounded-b-md font-semibold" onClick={onToggle}>
                        {open ? (
                            <div className="flex items-center">
                                <i className="fas fa-chevron-up me-2"></i>
                                <div className="lg:flex leading-none ">
                                    <div>팝업</div>
                                    <div>닫기</div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <i className="fas fa-chevron-down me-2"></i>
                                <div className="lg:flex leading-none">
                                    <div>팝업</div>
                                    <div>열기</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
