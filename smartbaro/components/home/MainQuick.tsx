import Link from 'next/link';
export default function MainQuick({ go_next_page, device }: any) {
    return (
        <div>
            {device == 'desktop' && (
                <div className="bg-second">
                    <div className="header_gnb_wrap h-24">
                        <div className="flex-none w-52">
                            <Link href="/">
                                <span className="sr-only">logo</span>
                                <img src="/resource/images/company/desktop/smartbaro_logo.png" className="w-48" alt="" />
                            </Link>
                        </div>
                        <div className="flex-1 h-full">
                            <div className="grid grid-cols-5">
                                <div className="pc-nav-item ps-14">
                                    <button
                                        onClick={e => {
                                            go_next_page('/medical/2');
                                        }}
                                        className="flex items-center w-full border-r"
                                    >
                                        <div className="rounded-full bg-white p-2 flex-shrink-0">
                                            <img alt="img" src="/resource/images/main/desktop/icon_quick05.png" className="w-full" />
                                        </div>
                                        <div className="flex-grow-1 ps-5">
                                            <span className="text-white text-xl font-bold">진료예약</span>
                                        </div>
                                    </button>
                                </div>
                                <div className="pc-nav-item ps-5">
                                    <button
                                        onClick={e => {
                                            go_next_page('/medical/1');
                                        }}
                                        className="flex items-center w-full border-r"
                                    >
                                        <div className="rounded-full bg-white p-1 flex-shrink-0">
                                            <img alt="img" src="/resource/images/main/desktop/icon_quick05_1.png" className="w-full" />
                                        </div>
                                        <div className="flex-grow-1 ps-5">
                                            <span className="text-white text-xl font-bold">진료시간안내</span>
                                        </div>
                                    </button>
                                </div>
                                <div className="pc-nav-item ps-5">
                                    <button
                                        onClick={e => {
                                            go_next_page('/medical/4');
                                        }}
                                        className="flex items-center w-full border-r"
                                    >
                                        <div className="rounded-full bg-white p-2 flex-shrink-0">
                                            <img src="/resource/images/main/desktop/icon_quick07.png" alt="" className="w-full" />
                                        </div>
                                        <div className="flex-grow-1 ps-5">
                                            <span className="text-white text-xl font-bold">온라인상담</span>
                                        </div>
                                    </button>
                                </div>
                                <div className="pc-nav-item ps-5">
                                    <button
                                        onClick={e => {
                                            go_next_page('/company/7');
                                        }}
                                        className="flex items-center w-full border-r"
                                    >
                                        <div className="rounded-full bg-white p-1 flex-shrink-0">
                                            <img src="/resource/images/main/desktop/icon_quick06.png" alt="" className="w-full" />
                                        </div>
                                        <div className="flex-grow-1 ps-5">
                                            <span className="text-white text-xl font-bold">찾아오시는 길</span>
                                        </div>
                                    </button>
                                </div>
                                <div className="pc-nav-item ps-5">
                                    <div className="flex items-center w-full">
                                        <div className="flex-grow-1 ps-5">
                                            <span className="text-white text-xl font-bold">
                                                <div className="text-2xl">032)722-8585</div>
                                                <div className="text-sm font-normal">예약 1번 | 검진 2번 | 서류 3번</div>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
