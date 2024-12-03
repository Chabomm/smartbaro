import { cls } from '@/libs/utils';

export default function Medical({ data, pagination, go_next_page, device }: any) {
    return (
        <div>
            <section className="site-width padding-y">
                <div className="main_sub_tit pb-2.5">MEDICAL CENTER</div>
                <div className="subject">
                    <span className="font-normal">국제바로병원</span> 진료 센터
                </div>
            </section>
            <section className={cls('site-width', device == 'desktop' ? 'pb-120' : 'pb-14')}>
                <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 mb-3">
                    {data.MEDICAL_BANNER_LIST?.map((v: any, i: number) =>
                        i <= 2 ? (
                            <div key={`MEDICAL_BANNER_LIST_${i}`} className="col-span-4 lg:col-span-4">
                                <div
                                    className={cls(v.link != '' ? 'cursor-pointer' : '')}
                                    onClick={e => {
                                        if (v.link != '') {
                                            go_next_page(`${v.link}`);
                                        }
                                    }}
                                >
                                    <img src={v.banner_src} alt={v.banner_name} className="w-full" />
                                </div>
                            </div>
                        ) : (
                            <div key={`MEDICAL_BANNER_LIST_${i}`} className="col-span-2 lg:col-span-2">
                                <div
                                    className={cls(v.link != '' ? 'cursor-pointer' : '')}
                                    onClick={e => {
                                        if (v.link != '') {
                                            go_next_page(`${v.link}`);
                                        }
                                    }}
                                >
                                    <img src={v.banner_src} alt={v.banner_name} className="w-full" />
                                </div>
                            </div>
                        )
                    )}
                </div>
            </section>
        </div>
    );
}

/////// v2
// export default function Medical({ data, pagination, go_next_page, device }: any) {
//     return (
//         <div>
//             <section className="site-width padding-y">
//                 <div className="main_sub_tit pb-2.5">MEDICAL CENTER</div>
//                 <div className="subject">
//                     <span className="font-normal">국제바로병원</span> 진료 센터
//                 </div>
//             </section>
//             <section className={cls('site-width', device == 'desktop' ? 'pb-120' : 'pb-14')}>
//                 <div className="grid grid-cols-2 gap-3 mb-3">
//                     {data.MEDICAL_BANNER_LIST?.map((v: any, i: number) => {
//                         if (i == 0 || i == 1) {
//                             return (
//                                 <div key={`MEDICAL_BANNER_LIST_${i}`}>
//                                     <div className="p-5 lg:px-10 lg:py-20 medical_background" style={{ backgroundImage: `url(${v.banner_src})` }}>
//                                         <div className="lg:grid grid-cols-2">
//                                             <div></div>
//                                             <div className="text-box text-center">
//                                                 <div className={cls('font-bold mb-3', device == 'desktop' ? 'text-3xl' : 'text-xl')}>{v.banner_name}</div>
//                                                 <div className="item-desc" dangerouslySetInnerHTML={{ __html: v.txt1 }}></div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             );
//                         }
//                     })}
//                 </div>
//                 <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
//                     {data.MEDICAL_BANNER_LIST?.map((v: any, i: number) => {
//                         if (i == 2 || i == 3 || i == 4) {
//                             return (
//                                 <div key={`MEDICAL_BANNER_LIST_${i}`}>
//                                     <div className="p-5 lg:px-10 lg:py-20 medical_background" style={{ backgroundImage: `url(${v.banner_src})` }}>
//                                         <div className="">
//                                             <div className="text-box text-center">
//                                                 <div className={cls('font-bold mb-3', device == 'desktop' ? 'text-3xl' : 'text-xl')}>{v.banner_name}</div>
//                                                 <div className="item-desc" dangerouslySetInnerHTML={{ __html: v.txt1 }}></div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             );
//                         }
//                     })}
//                 </div>
//             </section>
//         </div>
//     );
// }

////// v1
// import { useEffect, useState } from 'react';
// import { isDesktop } from 'react-device-detect';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay } from 'swiper';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';
// import 'swiper/css/free-mode';
// import { cls } from '@/libs/utils';

// export default function Medical({ data, pagination, go_next_page }: any) {
//     const [swiper, setSwiper] = useState<any>();
//     const [medicalEnd, setMedicalEnd] = useState<boolean>(false);
//     const [medicalFirst, setMedicalFirst] = useState<boolean>(false);

//     useEffect(() => {
//         setMedicalEnd(false);
//         setMedicalFirst(false);
//     }, [data]);

//     const [desktop, setDesktop] = useState<boolean>(true);
//     useEffect(() => {
//         setDesktop(isDesktop);
//     }, [isDesktop]);

//     return (
//         <div>
//             <section className="site-width padding-y">
//                 <div className="main_sub_tit pb-2.5">MEDICAL CENTER</div>
//                 <div className="subject">
//                     <span className="font-normal">국제바로병원</span> 진료 센터
//                 </div>
//             </section>
//             <section className={cls(desktop ? 'pb-120' : 'pb-14')}>
//                 <div className="relative">
//                     <Swiper
//                         modules={[Autoplay]}
//                         autoplay={{
//                             delay: 1000,
//                             disableOnInteraction: false,
//                         }}
//                         speed={1000}
//                         initialSlide={1}
//                         centeredSlides={true}
//                         spaceBetween={20}
//                         slidesPerView={'auto'}
//                         slideToClickedSlide={true}
//                         onBeforeInit={swipper => setSwiper(swipper)}
//                         onSlideChange={e => {
//                             e.isEnd ? setMedicalEnd(true) : setMedicalEnd(false);
//                             e.isBeginning ? setMedicalFirst(true) : setMedicalFirst(false);
//                         }}
//                     >
//                         {data.MEDICAL_BANNER_LIST?.map((v: any, i: number) => (
//                             <SwiperSlide key={`MEDICAL_BANNER_LIST_${i}`} style={desktop ? { width: '896px' } : { width: '257px' }}>
//                                 <div className="relative">
//                                     <button
//                                         className="w-full"
//                                         onClick={e => {
//                                             go_next_page(v.link);
//                                         }}
//                                     >
//                                         <div className="overlay_main_medical"></div>
//                                         <div className="medical_item">
//                                             <img src={v.banner_src} alt="" className="me-14" style={{ width: '448px' }} />
//                                             <div className="text-box">
//                                                 <div className={cls('font-bold', desktop ? 'text-3xl' : 'text-xl')}>{v.banner_name}</div>
//                                                 <div className="item-desc" dangerouslySetInnerHTML={{ __html: v.txt1 }}></div>
//                                                 <div className="inline-block border border-black py-1 px-6 text-sm hover:bg-white hover:text-black">바로가기 {`>`}</div>
//                                             </div>
//                                         </div>
//                                     </button>
//                                 </div>
//                             </SwiperSlide>
//                         ))}
//                     </Swiper>
//                     <div onClick={() => swiper?.slidePrev()} className="swiper_button_wrap swiper_button_prev main_swiper_prev">
//                         <button disabled={medicalFirst} className={cls(medicalFirst ? 'swiper_slide_fin' : '')}></button>
//                     </div>
//                     <div onClick={() => swiper?.slideNext()} className="swiper_button_wrap swiper_button_next main_swiper_next">
//                         <button disabled={medicalEnd} className={cls(medicalEnd ? 'swiper_slide_fin' : '')}></button>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// }
