import { motion } from 'framer-motion';
import nav from '../pages/api/nav.json';
import { cls } from '@/libs/utils';

export default function pageHeader({ params, device }) {
    const navs = params?.nav_id?.split('/');
    const depth_1 = typeof navs === 'undefined' ? '' : navs[1];
    const depth_2 = typeof navs === 'undefined' ? '' : navs[2];
    const depth_3 = typeof navs === 'undefined' ? '' : navs[3];

    let title = params.title;

    if (typeof params.nav_id !== 'undefined') {
        nav.navi_list.map((v, i) => {
            if (params.nav_id.indexOf(v.id) == 1) {
                title = typeof title === 'undefined' ? v.name : title;
            }
        });
    }

    const getBackgroundColor = (code: string) => {
        if (code == 'company') {
            return '#2a4e90';
        } else if (code == 'medical') {
            return '#fafbfd';
        } else if (code == 'knee') {
            return '#e0dbd8';
        } else if (code == 'shoulder') {
            return '#fcfcfc';
        } else if (code == 'handfoot') {
            return '#f9f9f9';
        } else if (code == 'hipjoint') {
            return '#d8d9de';
        } else if (code == 'cranial') {
            return '#e9eaee';
        } else if (code == 'screening') {
            return '#e8e8ef';
        } else if (code == 'bbs') {
            return '#e6e8e7';
        } else if (code == 'terms') {
            return '#e0dbd8';
        }
        return '#ffffff';
    };

    return (
        <div className="overflow-hidden relative h-48 lg:h-80">
            {/* 높이 320px 으로 디자인요청 */}
            <div className="absolute w-full h-full opacity-60 bg-black top-0 left-0 z-10"></div>
            <div
                className={cls('w-full h-full bg-no-repeat bg-center', device == 'desktop' ? '' : 'bg-cover')}
                style={{ backgroundColor: `${getBackgroundColor(depth_1)}`, backgroundImage: `url(/resource/images/page_header/${depth_1}.jpg)` }}
            ></div>
            <div className="absolute z-20 -translate-x-1/2 -translate-y-1/2 text-white left-1/2 top-1/2 text-center">
                <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div className="page_header_title">{title}</div>
                    <div className="page_header_subtitle">{params.sub_title}</div>
                </motion.div>
            </div>
        </div>
    );
}
