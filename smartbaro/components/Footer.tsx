import Link from 'next/link';
import { cls } from '@/libs/utils';
import QuickMenu from './QuickMenu';

export default function Footer({ nav_id, title, device }: any) {
    const scrollTop = async () => {
        window.scrollTo(0, 0);
    };

    return (
        <section className="">
            <QuickMenu />
            <div className="" style={{ backgroundColor: '#ededed' }}>
                <div className="site-width footer">
                    <div className="footer_area">
                        <div className="footer_logo_area">
                            <img src="/resr/images/common/footer_logo.png" className=" w-56" alt="" />
                        </div>
                        <div className={cls('footer_info text-sm', device == 'desktop' ? 'mb-3' : 'tracking-tight')}>
                            <div className="pb-6">
                                <Link href={'/terms/privacy'} className="font-bold">
                                    개인정보 취급방침
                                </Link>
                                <Link href={'/terms/provision'}> ･ 환자권리장전 </Link>
                                <Link href={'/terms/email'}>･ 이메일 무단수집거부</Link>
                            </div>
                            <div className="leading-loose">
                                <div className="lg:flex footer_info_bar">
                                    <div>인천광역시 남동구 석정로 518번지</div>
                                    <div>상호명 : 국제바로병원 ㅣ 대표자 : 이정준</div>
                                </div>
                                <div className="lg:flex footer_info_bar">
                                    <div>사업자등록번호 : 121-91-52346</div>
                                    <div>TEL : 032-722-8585</div>
                                </div>
                                <div className="tracking-tighter text-xs">COPYRIGHT(C) 2015 BARO MEDICAL. ALL RIGHTS RESERVED.</div>
                            </div>
                        </div>
                        <div className="flex ms-6">
                            <div className="overflow-hidden rounded-full inline-block mb-5 mt-7 mx-1">
                                <Link href="https://blog.naver.com/PostList.naver?blogId=zoz2639&from=postList&categoryNo=13" target="_blank">
                                    <img src="/resource/images/main/desktop/icon_sns-01.png" alt="" />
                                </Link>
                            </div>
                            <div className="overflow-hidden rounded-full inline-block mb-5 mt-7 mx-1">
                                <Link href="https://pf.kakao.com/_rdxmaV" target="_blank">
                                    <img src="/resource/images/main/desktop/icon_sns-02.png" alt="" />
                                </Link>
                            </div>
                            <div className="overflow-hidden rounded-full inline-block mb-5 mt-7 mx-1">
                                <Link href="https://www.instagram.com/ibaro_hospital/" target="_blank">
                                    <img src="/resource/images/main/desktop/icon_sns-03.png" alt="" />
                                </Link>
                            </div>
                            <div className="overflow-hidden rounded-full inline-block mb-5 mt-7 mx-1">
                                <Link href="https://www.youtube.com/channel/UC7MgSQPfQn4A9UFjRH6UDsg" target="_blank">
                                    <img src="/resource/images/main/desktop/icon_sns-04.png" alt="" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
