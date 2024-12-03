import type { NextPage } from 'next';
import React from 'react';
import { useRouter } from 'next/router';

const SetupImagesViewer: NextPage = (props: any) => {
    const router = useRouter();
    const { path } = router.query;
    return (
        <div className="hover:bg-gray-500">
            <div className="border-b border-slate-200 py-3 px-2 border-l-4 border-l-indigo-300 bg-gradient-to-r from-indigo-100 to-transparent hover:from-indigo-200 transition ease-linear duration-150 my-5">
                <div>투명한 흰색 이미지는 마우스를 올리면 확인가능합니다.</div>
            </div>
            <img src={path + ''} className="w-full" alt="img_view"></img>
        </div>
    );
};

export default SetupImagesViewer;
