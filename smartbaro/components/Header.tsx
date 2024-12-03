import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { cls } from '@/libs/utils';
import nav from '../pages/api/nav.json';
import AccordionMenu from '@/components/UIcomponent/AccordionMenu';
import TopMenu from './home/TopMenu';
import TopBanner from './home/TopBanner';
import { api } from '@/libs/axios';

function NavLink({ to, target, children }) {
    return (
        <Link href={to} className="block" target={target}>
            <span className="hover-underline-animation">{children}</span>
        </Link>
    );
}

export default function Header({ nav_id, title, device }: any) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        getMainJson();
    }, []);

    const [data, setData] = useState<any>({});
    const getMainJson = async () => {
        try {
            const { data } = await api.get(`/resource/main/MAIN.json?${Math.floor(Date.now() / 1000)}`, {});
            setData(data);
        } catch (e) {}
    };

    const router = useRouter();
    useEffect(() => {
        try {
            let body = document.querySelector<HTMLElement>('body');
            body!.classList.remove('overflow-hidden');
            setOpen(false);
        } catch (e) {}
    }, [router]);

    function showNaviSub() {
        setOpen(true);
    }

    function hideNaviSub() {
        setOpen(false);
    }

    return (
        <>
            <TopBanner data={data} nav_id={nav_id} device={device} />

            <nav className={cls('header_gnb bg-white', nav_id == '/' ? '' : '')}>
                {device == 'desktop' && <TopMenu data={data} />}
                <div className="header_gnb_wrap">
                    <div className="header_gnb_logo">
                        <Link href="/">
                            <span className="sr-only">logo</span>
                            <img alt="img" src="/resource/images/logo.png" />
                        </Link>
                    </div>
                    {device == 'desktop' && (
                        <div className="flex-1 h-full">
                            <div onMouseEnter={showNaviSub} onMouseLeave={hideNaviSub}>
                                <div className="grid grid-cols-9">
                                    {nav.navi_list.map((v, i) => {
                                        if (!v.is_hidden) {
                                            return (
                                                <div key={i} className={cls('pc-nav-item', nav_id.indexOf(v.id) == 1 ? 'on' : '')}>
                                                    <Link href={v.to}>
                                                        <span className={cls(nav_id.indexOf(v.id) == 1 ? 'text-point' : '')}>{v.name}</span>
                                                    </Link>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                                <div className="w-full bg-white absolute left-0">
                                    <div className={cls('relative header_gnb_wrap transition-all duration-500', open ? 'opacity-100' : 'opacity-0 !hidden')}>
                                        {data.GNB_LIST?.map((v: any, i: number) => (
                                            <Link href={v.link} key={i} className="absolute bottom-2.5 right-0">
                                                {i == 0 && <img src={v.banner_src} alt="" className="w-full" />}
                                            </Link>
                                        ))}
                                        <div className="flex-none w-52"></div>
                                        <div className="flex-1">
                                            <div className="grid grid-cols-9">
                                                {nav.navi_list.map((v, i) => {
                                                    if (!v.is_hidden) {
                                                        return (
                                                            <div key={i} className={cls('py-7 hover:bg-gray-50', nav_id.indexOf(v.id) == 1 ? 'bg-gray-50' : '')}>
                                                                {v.children.map((vv, ii) => (
                                                                    <div className="mb-5 text-center" key={ii}>
                                                                        <div className="pc-nav-sub-item">
                                                                            <NavLink to={vv.to} target={vv.target}>
                                                                                <span
                                                                                    className={cls(
                                                                                        'hover:font-bold',
                                                                                        nav_id == vv.id || nav_id.indexOf(vv.id) == 0 ? 'font-bold text-point' : ''
                                                                                    )}
                                                                                >
                                                                                    {vv.name}
                                                                                </span>
                                                                            </NavLink>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        );
                                                    }
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {device == 'mobile' && (
                        <>
                            <div
                                className="z-50 flex relative w-6 h-6 flex-col justify-between items-center lg:hidden"
                                onClick={() => {
                                    setOpen(!open);
                                    let body_el = document.querySelector('body') || undefined;
                                    if (!open) {
                                        if (typeof body_el !== 'undefined') {
                                            body_el.classList.add('overflow-hidden');
                                        }
                                    } else {
                                        if (typeof body_el !== 'undefined') {
                                            body_el.classList.remove('overflow-hidden');
                                        }
                                    }
                                }}
                            >
                                <span className={`h-1 w-full bg-black rounded-lg transform transition duration-300 ease-in-out ${open ? 'rotate-45 translate-y-2.5' : ''}`} />
                                <span className={`h-1 w-full bg-black rounded-lg transition-all duration-300 ease-in-out ${open ? 'hidden' : 'w-full'}`} />
                                <span className={`h-1 w-full bg-black rounded-lg transform transition duration-300 ease-in-out ${open ? '-rotate-45 -translate-y-2.5' : ''}`} />
                            </div>

                            <div className={cls('mobile_gnb_sub top-16 transition-all duration-500 pb-40', open ? 'opacity-100 left-0' : 'opacity-0 -left-full')}>
                                <div className={cls('header_gnb_wrap !px-0')}>
                                    <div className="w-full">
                                        {nav.navi_list.map((v, i) => (
                                            <AccordionMenu key={i} menu={v} NavLink={NavLink}></AccordionMenu>
                                        ))}
                                    </div>
                                </div>
                                {data.GNB_LIST?.map((v: any, i: number) => (
                                    <Link href={v.link} key={i} className="flex items-center justify-evenly p-4">
                                        {i == 0 && <img src={v.banner_src} alt="" className="w-full" />}
                                    </Link>
                                ))}
                                <div className="flex items-center justify-evenly py-2">
                                    <div className="px-3">
                                        <Link href={'https://eng.smartbaro.com/'} target="_blank">
                                            <div className="flex items-center">
                                                <img src="/resource/images/common/eng.png" alt="" className="w-5 h-5" />
                                                <span className="leading-8 text-sm font-bold text-zinc-500 ms-2">ENG</span>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="h-6 border-r"></div>
                                    <div className="px-3">
                                        <Link href={'https://chn.smartbaro.com/'} target="_blank">
                                            <div className="flex items-center">
                                                <img src="/resource/images/common/chn.png" alt="" className="w-5 h-5" />
                                                <span className="leading-8 text-sm font-bold text-zinc-500 ms-2">CHN</span>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </nav>
            <div className={cls('transition-all duration-500', open ? 'backdrop opacity-100' : 'opacity-0')}></div>
        </>
    );
}
