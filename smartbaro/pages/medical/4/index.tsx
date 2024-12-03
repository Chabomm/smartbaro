import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import Layout from '@/components/Layout';
import Seo from '@/components/Seo';
import PageHeader from '@/components/PageHeader';
import Breadcrumb from '@/components/Breadcrumb';
import BoardPostList from '@/pages/bbs/board/list';
import { getAgentDevice } from '@/libs/utils';

const Medical_4: NextPage = (props: any) => {
    const nav_id = '/medical/4';
    const nav_name = '전문의 상담';
    const page_header = { nav_id: nav_id, sub_title: nav_name };
    return (
        <Layout title={nav_name} nav_id={nav_id} device={props.device}>
            <Seo title={nav_name} />
            <PageHeader params={page_header} device={props.device} />
            <Breadcrumb nav_id={nav_id} device={props.device} />
            <div className="subject padding-y">{nav_name}</div>
            <BoardPostList board_uid={9} device={props.device} no_cache={props.no_cache} />
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    // 등록하기 페이지에서 router 이동된 경우 리스트 다시 호출
    // 방금 등록한 글을 보기 위함. by.namgu
    const referer: string = ctx.req.headers.referer + '';
    let no_cache = false;
    if (referer.indexOf('/medical/4/reg') > -1) {
        no_cache = true;
    }

    return {
        props: { device: getAgentDevice(ctx), no_cache: no_cache },
    };
};

export default Medical_4;
