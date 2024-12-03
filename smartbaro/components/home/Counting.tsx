import { cls } from '@/libs/utils';
import VisibilitySensor from 'react-visibility-sensor';
import dynamic from 'next/dynamic';
const CountUp = dynamic(() => import('react-countup'), { ssr: false });

export default function Counting({ data, device }: any) {
    return (
        <div>
            <section className="site-width padding-y text-center">
                <div className="main_sub_tit pb-2.5">REPORTED</div>
                <div className={cls('subject', device == 'desktop' ? 'pb-20' : 'pb-10')}>
                    <span className="font-normal">국제바로병원</span> 성과
                </div>
                <div className="main_counting_tit">
                    <div>내 척추, 내 관절처럼</div>
                    <div>
                        <b>언제나 당신의 입장에서</b>
                    </div>
                    <div>치료는 시작됩니다.</div>
                </div>
                {data.MAIN_COUNT_LIST?.map((v, i) => (
                    <div key={i} className={cls('counting-wrap', device == 'desktop' ? 'flex items-end justify-center' : '')}>
                        <div className="item-box">
                            <span className={cls('text-neutral-500', device == 'desktop' ? 'text-xl' : 'text-base')}>외래 내원 환자 수</span>
                            <div className="num">
                                <span className="counter">
                                    <CountUp end={v.txt1.replace(/,/g, '')} redraw={true}>
                                        {({ countUpRef, start }) => (
                                            <VisibilitySensor onChange={start} delayedCall>
                                                <span ref={countUpRef} />
                                            </VisibilitySensor>
                                        )}
                                    </CountUp>
                                </span>
                                <span className={cls(device == 'desktop' ? 'text-4xl' : 'text-2xl')}>명</span>
                            </div>
                        </div>
                        <div className="sub-bar"></div>
                        <div className="item-box">
                            <span className={cls('text-neutral-500', device == 'desktop' ? 'text-xl' : 'text-base')}>관절 수술 환자 수</span>
                            <div className="num !text-point font-extrabold pt-4 px-14">
                                <span className="counter ">
                                    <CountUp end={v.txt2.replace(/,/g, '')} redraw={true}>
                                        {({ countUpRef, start }) => (
                                            <VisibilitySensor onChange={start} delayedCall>
                                                <span ref={countUpRef} />
                                            </VisibilitySensor>
                                        )}
                                    </CountUp>
                                </span>
                                <span className="text-4xl">명</span>
                            </div>
                        </div>
                        <div className="sub-bar"></div>
                        <div className="item-box">
                            <span className={cls('text-neutral-500', device == 'desktop' ? 'text-xl' : 'text-base')}>척추 수술 환자 수</span>
                            <div className="num">
                                <span className="counter">
                                    <CountUp end={v.txt3.replace(/,/g, '')} redraw={true}>
                                        {({ countUpRef, start }) => (
                                            <VisibilitySensor onChange={start} delayedCall>
                                                <span ref={countUpRef} />
                                            </VisibilitySensor>
                                        )}
                                    </CountUp>
                                </span>
                                <span className="text-4xl">명</span>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
