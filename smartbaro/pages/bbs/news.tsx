import type { GetServerSideProps, NextPage, NextPageContext } from 'next';
import React from 'react';
import Layout from '@/components/Layout';
import Seo from '@/components/Seo';
import PageHeader from '@/components/PageHeader';
import Breadcrumb from '@/components/Breadcrumb';
import BoardPostGallery from './board/gallery';
import { getAgentDevice } from '@/libs/utils';

const FrontBoardNews: NextPage = (props: any) => {
    const nav_id = '/bbs/news';
    const nav_name = '병원소식';
    const page_header = { nav_id: nav_id, sub_title: nav_name };

    return (
        <Layout title={nav_name} nav_id={nav_id} device={props.device}>
            <Seo title={nav_name} />
            <PageHeader params={page_header} device={props.device} />
            <Breadcrumb nav_id={nav_id} device={props.device} />
            <div className="subject padding-y">{nav_name}</div>
            <BoardPostGallery board_uid={1} hidden_date={false} device={props.device} />
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    return {
        props: { device: getAgentDevice(ctx) },
    };
};

export default FrontBoardNews;
