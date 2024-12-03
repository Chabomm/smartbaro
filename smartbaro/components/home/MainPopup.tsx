import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cls, setCookie, getCookie } from '@/libs/utils';

export default function MainPopup({ data, go_next_page, device }: any) {
    const [open, setOpen] = useState<boolean>(false);

    const onToggle = () => {
        setOpen(!open);
    };

    useEffect(() => {
        if (getCookie('MAIN_POPUP_' + data.uid) != 'done') {
            setOpen(true);
        }
    }, []);

    const neverToday = () => {
        setCookie('MAIN_POPUP_' + data.uid, 'done', 1);
        setOpen(false);
    };

    return (
        <div className={cls('popup', open ? 'open' : '', device == 'desktop' ? '' : 'absolute z-20 left-1/2 -translate-x-1/2 top-64')}>
            <div className="border border-black">
                {data.link == '' ? (
                    <img className="popup_img" src={data.banner_src} />
                ) : (
                    <Link href={data.link}>
                        <img className="popup_img" src={data.banner_src} />
                    </Link>
                )}
                <div className="bg-slate-700 text-white border-t border-black py-2 px-3 flex justify-between">
                    <button type="button" onClick={neverToday}>
                        24시간 동안 다시 열람하지 않습니다
                    </button>
                    <button type="button" onClick={onToggle}>
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
