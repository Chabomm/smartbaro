import Link from 'next/link';
export default function TopMenu({ data, go_next_page, device }: any) {
    return (
        <div className="w-full h-12 border-b">
            <div className="site-width flex justify-between py-2">
                <div className="grid grid-cols-2">
                    {data.TOP_MENU_LIST?.map((v: any, i: number) => (
                        <div key={i}>
                            <Link href={v.link}>
                                <div className="">
                                    <img src={v.banner_src} className="inline-block me-2" />
                                    <span className="text-sm text-yellow-600">{v.txt1}</span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-5 me-28">
                    <div>
                        <Link href={'https://eng.smartbaro.com/'} target="_blank">
                            <div className="flex items-center">
                                <img src="/resource/images/common/eng.png" alt="" className="w-7 h-7" />
                                <span className="leading-8 font-bold text-zinc-500 ms-2">ENG</span>
                            </div>
                        </Link>
                    </div>
                    <div>
                        <Link href={'https://chn.smartbaro.com/'} target="_blank">
                            <div className="flex items-center">
                                <img src="/resource/images/common/chn.png" alt="" className="w-7 h-7" />
                                <span className="leading-8 font-bold text-zinc-500 ms-2">CHN</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
