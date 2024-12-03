import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { cls } from '@/libs/utils';
export default function QuickMenu({ go_next_page, device }: any) {
    const scrollTop = async () => {
        window.scrollTo(0, 0);
    };

    const [showGoUp, setShowGoUp] = useState<boolean>(false);
    const handleScroll = useCallback(e => {
        if (300 >= window.scrollY) {
            setShowGoUp(false);
        } else {
            setShowGoUp(true);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            {/* 웹PC 버전 */}
            <div className="hidden lg:block">
                <div className="fixed w-full bottom-0 z-50">
                    <div className="quick_menu">
                        <div className="bg-point text-white text-2xl font-bold p-5 leading-none">
                            <div>032</div>
                            <div>722</div>8585
                        </div>
                        <div className="py-2 border-b">
                            <Link href={'/medical/2'} className="">
                                <img alt="img" src="/resource/images/main/desktop/icon_quick05.png" className="mx-auto" />
                                <div className="text-sm">진료예약</div>
                            </Link>
                        </div>
                        <div className="py-2 border-b">
                            <Link href="/medical/4">
                                <img alt="img" src="/resource/images/main/desktop/icon_quick02.png" className="mx-auto" />
                                <div className="text-sm">온라인상담</div>
                            </Link>
                        </div>
                        <div className="py-2 border-b">
                            <Link href="/medical/3">
                                <img alt="img" src="/resource/images/main/desktop/icon_quick03.png" className="mx-auto" />
                                <div className="text-sm">제증명발급</div>
                            </Link>
                        </div>
                        <div className="py-2 border-b">
                            <Link href={'/company/4'}>
                                <img alt="img" src="/resource/images/main/desktop/icon_quick04.png" className="mx-auto" />
                                <div className="text-sm">의료진소개</div>
                            </Link>
                        </div>
                        <div className="py-2 border-b">
                            <Link href={'/medical/1'}>
                                <img alt="img" src="/resource/images/main/desktop/icon_quick05.png" className="mx-auto" />
                                <div className="text-sm">진료시간안내</div>
                            </Link>
                        </div>
                        <div className="py-2 border-b">
                            <Link href={'/company/7'}>
                                <img alt="img" src="/resource/images/main/desktop/icon_quick06.png" className="inline-block" />
                                <div className="text-sm">오시는길</div>
                            </Link>
                        </div>
                        <div
                            className="bg-point text-white text-sm font-bold p-5 cursor-pointer"
                            onClick={() => {
                                scrollTop();
                            }}
                        >
                            <i className="fas fa-chevron-up fa-lg"></i>
                            <div className="pt-2">TOP</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 모바일 버전 */}
            <div className="block lg:hidden">
                <div className="fixed w-full bottom-0 z-50">
                    {/* <div className={cls('quick_menu', showGoUp ? 'transition-all opacity-100 duration-500 !bottom-20' : 'transition-all duration-500 opacity-0 !bottom-0')}> */}
                    <div className={cls('quick_menu')}>
                        <div
                            className="bg-point text-white text-xs p-2 px-3 cursor-pointer"
                            onClick={() => {
                                scrollTop();
                            }}
                        >
                            <i className="fas fa-chevron-up fa-md"></i>
                            <div>TOP</div>
                        </div>
                    </div>
                </div>
                <div className="fixed w-full bottom-0 left-0 z-50 py-2.5 border-t" style={{ backgroundColor: '#ffffff', zIndex: '9999' }}>
                    <div className="grid grid-cols-4 text-center">
                        <div className="">
                            <Link href={'/medical/2'} className="">
                                <img alt="img" src="/resource/images/main/desktop/icon_quick05.png" className="mx-auto h-10" />
                                <div className="text-xs">진료예약</div>
                            </Link>
                        </div>
                        <div className="">
                            <Link href="/medical/1">
                                <img alt="img" src="/resource/images/main/desktop/icon_quick05_1.png" className="mx-auto h-10" />
                                <div className="text-xs">진료시간안내</div>
                            </Link>
                        </div>
                        <div className="">
                            <Link href="/medical/3">
                                <img alt="img" src="/resource/images/main/desktop/icon_quick03.png" className="mx-auto h-10" />
                                <div className="text-xs">제증명발급</div>
                            </Link>
                        </div>

                        <div className="">
                            <Link href={'/company/7'}>
                                <img alt="img" src="/resource/images/main/desktop/icon_quick06.png" className="inline-block h-10" />
                                <div className="text-xs">찾아오시는길</div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
