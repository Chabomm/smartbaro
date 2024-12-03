import { StaticMap } from 'react-kakao-maps-sdk';
import { cls } from '@/libs/utils';
export default function Location({ device }: any) {
    return (
        <div>
            <section className={cls('site-width padding-y text-center', device == 'desktop' ? '' : 'px-5')}>
                <div className="main_sub_tit pb-2.5">LOCATION</div>
                <div className={cls('subject', device == 'desktop' ? 'pb-20' : 'pb-10')}>
                    <span className="font-normal">국제바로병원</span> 오시는 길
                </div>
                <div className={cls('border border-black', device == 'desktop' ? 'flex' : 'p-1')} style={{ backgroundColor: '#0c2348' }}>
                    <StaticMap
                        className="flex-1"
                        center={{ lat: 37.465384, lng: 126.693342 }}
                        style={{
                            width: '100%',
                        }}
                        marker={[
                            {
                                position: { lat: 37.465384, lng: 126.693342 },
                                text: '국제바로병원',
                            },
                        ]}
                        level={3}
                    />
                    <div className="location-box">
                        <div className="border-b border-b-white border-opacity-20" style={device == 'desktop' ? { paddingLeft: '2.25rem' } : {}}>
                            <div className="pb-7">
                                <div className={cls('txt-lg flex relative', device == 'desktop' ? '' : 'justify-center')}>
                                    <img src="/resource/images/main/desktop/icon_map01.png" alt="" className="h-7 me-2" />
                                    주소
                                </div>
                                <div className="txt-md">
                                    인천광역시 남동구 석정로 518
                                    <br />
                                    (인천광역시 남동구 간석동 895){' '}
                                </div>
                                <div className="txt-md text-gray-300">
                                    * 전용 주차타워에 무료 발렛주차 가능
                                    <br /> (외래진료, 수술 당일 무료 주차)
                                </div>
                            </div>
                        </div>
                        <div className="pt-7 border-b border-b-white border-opacity-20" style={device == 'desktop' ? { paddingLeft: '2.25rem' } : {}}>
                            <div className="pb-7">
                                <div className={cls('txt-lg flex relative', device == 'desktop' ? '' : 'justify-center')}>
                                    <img src="/resource/images/main/desktop/icon_map02.png" alt="" className="h-7 me-2" />
                                    대표번호
                                </div>
                                <div>
                                    <div className={cls('font-bold pt-2', device == 'desktop' ? 'text-3xl' : 'text-2xl')}>032)722-8585</div>
                                    <div className="txt-md text-gray-300 let tracking-tight">(예약1번 / 검진2번 / 서류3번 / 기타0번)</div>
                                </div>
                            </div>
                        </div>
                        <div className="pt-7" style={device == 'desktop' ? { paddingLeft: '2.25rem' } : {}}>
                            <div>
                                <div className={cls('txt-lg flex relative', device == 'desktop' ? '' : 'justify-center')}>
                                    <img src="/resource/images/main/desktop/icon_map03.png" alt="" className="h-7 me-2" />
                                    진료시간
                                </div>
                                <div className="txt-md pt-2 justify-between inline-flex">
                                    <div className={cls('flex-none', device == 'desktop' ? '' : 'text-start')}>
                                        <div>월요일</div>
                                        <div>화~금</div>
                                        <div>평일(야간)</div>
                                        <div>토요일</div>
                                        <div>(일요일/공휴일)</div>
                                    </div>
                                    <div className="sm_txt_box">
                                        <div>AM 08:30 ~ PM 18:00</div>
                                        <div>AM 09:00 ~ PM 18:00</div>
                                        <div>PM 18:00 ~ PM 20:00</div>
                                        <div>AM 08:30 ~ PM 13:00</div>
                                        <div>AM 09:00 ~ PM 18:00</div>
                                    </div>
                                </div>
                                <div className="txt-md text-gray-300">* 점심시간 13:00 ~ 14:00</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
