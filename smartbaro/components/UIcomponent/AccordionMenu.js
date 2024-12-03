import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
const AccordionUI = ({ menu, NavLink }) => {
    function cls(...classnames) {
        return classnames.join(' ');
    }

    const [opend, setOpend] = useState(false);
    const handleSetIndex = () => {
        setOpend(!opend);
    };

    const router = useRouter();
    useEffect(() => {
        if (menu?.to == router.pathname) {
            setOpend(true);
        }
        menu?.children.map((v, i) => {
            if (v.to == router.pathname) {
                setOpend(true);
            }
        });
    }, [router]);

    return (
        <>
            <div onClick={() => handleSetIndex()} className="w-full border-b border-slate-300 flex group justify-between items-center p-4">
                <div className="flex group">
                    <div className="text-slate-700 group-hover:font-bold text-lg font-bold">
                        {menu.children.length > 0 ? <>{menu.name}</> : <NavLink to={menu.to}>{menu.name}</NavLink>}
                    </div>
                </div>
                <div className={cls('flex items-center justify-center transition', opend ? 'rotate-180' : '')}>
                    <i className="fas fa-angle-down"></i>
                </div>
            </div>

            {opend && menu.children.length > 0 && (
                <div className="bg-zinc-100 text-slate-700 w-full p-4 border-1 border-slate-300">
                    {menu.children.map((v, i) => {
                        return (
                            <div className="mb-4" key={i}>
                                <Link href={v.to} className={`block`}>
                                    <span className={cls('hover-underline-animation', router.pathname === v.to ? 'text-point' : '')}>{v.name}</span>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
};

export default AccordionUI;
