import { cls } from '@/libs/utils';
import { useRouter } from 'next/router';

export default function News({ data, go_next_page, device }: any) {
    const router = useRouter();
    return (
        <div>
            <section className="site-width padding-y text-center">
                <div className="main_sub_tit pb-2.5">NEWS</div>
                <div className={cls('subject', device == 'desktop' ? 'pb-20' : 'pb-10')}>
                    <span className="font-normal">국제바로병원</span> NEWS
                </div>
                <div className={cls('grid grid-cols-1 lg:grid-cols-2 selection:justify-between', device == 'desktop' ? '' : 'px-4')}>
                    <div className="grid grid-cols-2 gap-3">
                        {data.NEWS_LIST?.map(
                            (v, i) =>
                                i < 2 && (
                                    <div key={i} className="news-item">
                                        <button
                                            onClick={e => {
                                                go_next_page(`/bbs/view/${v.uid}`);
                                            }}
                                        >
                                            <img src={v.thumb} alt="" className="inline-block" />
                                            <div className={cls('border-x border-b text-start', device == 'desktop' ? 'px-3.5 py-4' : 'p-2.5')}>
                                                <div className="item-tit line-hidden-2">{v.title}</div>
                                                <div className="text-sm text-neutral-500">{v.create_at}</div>
                                            </div>
                                        </button>
                                    </div>
                                )
                        )}
                    </div>
                    <div className="news-box">
                        <div className={cls('text-point font-bold flex justify-between mb-4', device == 'desktop' ? 'text-2xl' : 'text-xl')}>
                            병원 소식
                            <button
                                onClick={e => {
                                    go_next_page(`/bbs/news`);
                                }}
                            >
                                <img src="/resource/images/main/desktop/plus_icon.png" alt="" />
                            </button>
                        </div>
                        {data.NEWS_LIST?.map(
                            (v, i) =>
                                i >= 2 && (
                                    <div key={i} className={cls(i < 5 ? 'py-2.5 border-b' : 'pt-2.5')}>
                                        <button
                                            onClick={e => {
                                                go_next_page(`/bbs/view/${v.uid}`);
                                            }}
                                        >
                                            <div className={cls('font-bold line-hidden-1 text-start', device == 'desktop' ? 'text-lg' : 'text-base')}>{v.title}</div>
                                            <div className="text-sm text-neutral-500 text-start">{v.create_at}</div>
                                        </button>
                                    </div>
                                )
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
