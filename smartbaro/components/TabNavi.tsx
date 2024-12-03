import { cls } from '@/libs/utils';
import nav from '../pages/api/nav.json';
import React from 'react';
import Link from 'next/link';

export default function TabNavi(props: any) {
    const { nav_id, tab_gubun } = props;
    let tabItems: any = [];
    nav.navi_list.map((v, i) => {
        if (nav_id.indexOf(v.id) == 1) {
            v.children.map((vv, ii) => {
                if (nav_id.indexOf(vv.id) == 0 || nav_id == vv.id) {
                    vv.children?.map((vvv, iii) => {
                        let obj: any = {};
                        obj.id = vvv.id;
                        obj.name = vvv.name;
                        obj.to = vvv.to;
                        tabItems.push(obj);
                    });
                }
            });
        }
    });

    if (tab_gubun == 'knee_center') {
        return (
            <>
                <ul className="tabmenu !grid grid-cols-2 lg:grid-cols-4 border-b">
                    {tabItems.map((v, i) => (
                        <div key={i} className="flex-grow">
                            <Link href={v.to} className={cls('!border-b-0', v.id == nav_id ? 'on' : '')}>
                                {v.name}
                            </Link>
                        </div>
                    ))}
                </ul>
            </>
        );
    } else {
        return (
            <div>
                {tabItems.length > 6 ? (
                    <div className="tabmenu !grid grid-cols-3 lg:grid-cols-6 border-b">
                        {nav_id.indexOf('/company/4') == 0 && (
                            <div>
                                <Link href="/company/4" className={cls('!border-b-0', nav_id == '/company/4' ? 'on' : '')}>
                                    전체
                                </Link>
                            </div>
                        )}

                        {tabItems.map((v, i) => (
                            <div key={i} className="">
                                <Link href={v.to} className={cls('!border-b-0', v.id == nav_id ? 'on' : '')}>
                                    {v.name}
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <ul className="tabmenu">
                        {tabItems.map((v, i) => (
                            <div key={i} className="flex-grow">
                                <Link href={v.to} className={cls(v.id == nav_id ? 'on' : '')}>
                                    {v.name}
                                </Link>
                            </div>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
}
