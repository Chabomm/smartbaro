import type { NextPage } from 'next';
import React from 'react';
import Layout from '@/components/Layout';
import IntranetBoardPostGallery from './board/gallery';

const IntranetMarket: NextPage = (props: any) => {
    return (
        <Layout user={props.user} title="국제바로병원 인트라넷" nav_id={34} crumbs={['사진갤러리', '사진갤러리']}>
            <IntranetBoardPostGallery board_uid={17} />
        </Layout>
    );
};

export default IntranetMarket;
