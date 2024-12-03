import Link from 'next/link';
import { cls } from '@/libs/utils';
import nav from '../pages/api/nav.json';
import React, { useState } from 'react';

export default function Breadcrumb({ nav_id, device }: any) {
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);

    let depth1: any = [];
    let depth1_title: string = '';
    let depth1_id: string = '';
    nav.navi_list.map((v, i) => {
        let obj: any = {};
        obj.id = v.id;
        obj.name = v.name;
        obj.to = v.children[0].to;
        depth1.push(obj);
        if (nav_id.indexOf(v.id) == 1) {
            depth1_title = v.name;
            depth1_id = v.id;
        }
    });

    let depth2: any = [];
    let depth2_title: string = '';
    let depth2_id: string = '';
    nav.navi_list.map((v, i) => {
        if (nav_id.indexOf(v.id) == 1) {
            v.children.map((vv, ii) => {
                let obj: any = {};
                obj.id = vv.id;
                obj.name = vv.name;
                obj.to = vv.to;
                depth2.push(obj);
                if (nav_id.indexOf(vv.id) == 0 || nav_id == vv.id) {
                    depth2_title = vv.name;
                    depth2_id = vv.id;
                }
            });
        }
    });

    let depth3: any = [];
    let depth3_title: string = '';
    let depth3_id: string = '';
    nav.navi_list.map((v, i) => {
        if (nav_id.indexOf(v.id) == 1) {
            v.children.map((vv, ii) => {
                if (nav_id.indexOf(vv.id) == 0 || nav_id == vv.id) {
                    vv.children?.map((vvv, iii) => {
                        let obj: any = {};
                        obj.id = vvv.id;
                        obj.name = vvv.name;
                        obj.to = vvv.to;
                        depth3.push(obj);
                        if (nav_id == vvv.id) {
                            depth3_title = vvv.name;
                            depth3_id = vvv.id;
                            // depth3_to = vvv.to;
                        }
                    });
                }
            });
        }
    });

    return (
        <div className="h-14 bg-white border-b">
            <div className="site-width flex text-lg">
                <Link href="/">
                    <div className="h-14 w-16 flex items-center justify-center border-x">
                        <img src="/resource/images/common/home_icon.png" alt="" />
                    </div>
                </Link>

                <div className="flex-grow">
                    <div className={cls('relative', device == 'desktop' ? 'grid gap-0 grid-cols-3' : '')}>
                        <div className="border-e h-14 relative mobile-none">
                            <button
                                className={cls(
                                    'h-14 absolute z-10 w-full text-start flex justify-between items-center px-5 font-semibold',
                                    nav_id == depth1_id || nav_id.indexOf(depth1_id) == 0 ? 'text-black' : 'text-neutral-500'
                                )}
                                onClick={e => {
                                    setOpen1(!open1);
                                    setOpen2(false);
                                    setOpen3(false);
                                }}
                            >
                                {depth1_title}
                                {open1 ? <img src="/resource/images/common/chevron_up.png" alt="" /> : <img src="/resource/images/common/chevron_down.png" alt="" />}
                            </button>
                            <ul style={{ zIndex: '12' }} className={cls('absolute w-full transition-all duration-500 bg-white menu', open1 ? 'active' : '-top-300')}>
                                {depth1.map((v, i) => (
                                    <div key={i}>
                                        <Link href={v.to}>
                                            <div
                                                className={cls(
                                                    'block w-full text-base py-4 px-5 border-x border-b cursor-pointer hover:font-semibold hover:bg-slate-50',
                                                    nav_id == `${v.id}` ? 'font-semibold' : ''
                                                )}
                                            >
                                                {v.name}
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </ul>
                        </div>
                        <div className={cls('border-e h-14 relative', depth3.length > 0 && depth3_title ? 'mobile-none' : '')}>
                            <button
                                className={cls(
                                    'h-14 absolute z-10 w-full text-start flex justify-between items-center px-5 font-semibold ',
                                    nav_id == depth2_id ? 'text-black' : 'text-neutral-500'
                                )}
                                onClick={e => {
                                    setOpen1(false);
                                    setOpen2(!open2);
                                    setOpen3(false);
                                }}
                            >
                                {depth2_title}
                                {open2 ? <img src="/resource/images/common/chevron_up.png" alt="" /> : <img src="/resource/images/common/chevron_down.png" alt="" />}
                            </button>
                            <ul style={{ zIndex: '12' }} className={cls('absolute w-full transition-all duration-500 bg-white block menu', open2 ? 'active' : '-top-300')}>
                                {depth2.map((v, i) => (
                                    <div key={i}>
                                        <Link href={v.to}>
                                            <div
                                                className={cls(
                                                    'text-base py-4 px-5 border-x border-b cursor-pointer hover:font-semibold hover:bg-slate-50',
                                                    nav_id == `${v.id}` ? 'font-semibold' : ''
                                                )}
                                            >
                                                {v.name}
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </ul>
                        </div>
                        {depth3.length > 0 && depth3_title ? (
                            <div className="border-e h-14 relative">
                                <button
                                    className={cls(
                                        'h-14 absolute z-10 w-full text-start flex justify-between items-center px-5 font-semibold',
                                        nav_id == depth3_id ? 'text-black' : 'text-neutral-500'
                                    )}
                                    onClick={e => {
                                        setOpen1(false);
                                        setOpen2(false);
                                        setOpen3(!open3);
                                    }}
                                >
                                    {depth3_title}
                                    {open3 ? <img src="/resource/images/common/chevron_up.png" alt="" /> : <img src="/resource/images/common/chevron_down.png" alt="" />}
                                </button>
                                <ul style={{ zIndex: '12' }} className={cls('absolute w-full transition-all duration-500 bg-white block menu', open3 ? 'active' : '-top-300')}>
                                    {depth3.map((v, i) => (
                                        <div key={i}>
                                            <Link href={v.to}>
                                                <div
                                                    className={cls(
                                                        'text-base py-4 px-5 border-x border-b cursor-pointer hover:font-semibold hover:bg-slate-50',
                                                        nav_id == `${v.id}` ? 'font-semibold' : ''
                                                    )}
                                                >
                                                    {v.name}
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div></div>
                        )}
                        <div
                            onClick={e => {
                                setOpen1(false);
                                setOpen2(false);
                                setOpen3(false);
                            }}
                            className={cls('', open1 || open2 || open3 ? 'backdrop_breadcrumb ' : 'opacity-0')}
                        ></div>
                    </div>
                </div>
                {/* <DropdownMenu /> */}
            </div>
        </div>
    );
}
