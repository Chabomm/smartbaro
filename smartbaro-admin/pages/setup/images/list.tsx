import type { GetServerSideProps, NextPage } from 'next';
import React, { useState } from 'react';
import { api, setContext } from '@/libs/axios';
import { useRouter } from 'next/router';

import Layout from '@/components/Layout';
import FolderTree from '@/components/UIcomponent/FolderTree';

const SetupImagesList: NextPage = (props: any) => {
    const router = useRouter();
    const [params, setParams] = useState(props.request);
    const [posts, setPosts] = useState(props.response.list);

    return (
        <Layout user={props.user} title="국제바로병원 인트라넷" nav_id={29} crumbs={['환경설정', '이미지파일관리']}>
            <div className="border-b border-slate-200 py-3 px-2 border-l-4 border-l-indigo-300 bg-gradient-to-r from-indigo-100 to-transparent hover:from-indigo-200 transition ease-linear duration-150 my-5">
                <div>파일명이 이미지 url (경로)가 되기때문에 한글 사용은 자제 바랍니다.</div>
            </div>

            <div className="bg-white p-5 h-full">
                {posts.map((v: any, i: number) => {
                    return <FolderTree key={i} data={v}></FolderTree>;
                })}
            </div>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    setContext(ctx);
    var request: any = {};
    var response: any = {};
    try {
        const { data } = await api.post(`/be/admin/setup/images/folders`, request);
        response = data;
    } catch (e: any) {
        if (typeof e.redirect !== 'undefined') {
            return { redirect: e.redirect };
        }
    }
    return {
        props: { request, response },
    };
};
export default SetupImagesList;
