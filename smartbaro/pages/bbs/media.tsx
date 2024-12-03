import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import Layout from '@/components/Layout';
import Seo from '@/components/Seo';
import PageHeader from '@/components/PageHeader';
import Breadcrumb from '@/components/Breadcrumb';
import BoardPostGallery from './board/gallery';
import { getAgentDevice } from '@/libs/utils';

const FrontBoardMedia: NextPage = (props: any) => {
    const nav_id = '/bbs/media';
    const nav_name = '언론정보';
    const page_header = { nav_id: nav_id, sub_title: nav_name };

    return (
        <Layout title={nav_name} nav_id={nav_id} device={props.device}>
            <Seo title={nav_name} />
            <PageHeader params={page_header} device={props.device} />
            <Breadcrumb nav_id={nav_id} device={props.device} />
            <div className="subject padding-y">{nav_name}</div>
            <BoardPostGallery board_uid={2} hidden_date={true} device={props.device} />
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    return {
        props: { device: getAgentDevice(ctx) },
    };
};

export default FrontBoardMedia;
