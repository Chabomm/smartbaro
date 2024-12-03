import type { NextPage } from 'next';
import React from 'react';
import Layout from '@/components/Layout';
import IntranetBoardPostList from './board/list';

const IntranetMarket: NextPage = (props: any) => {
    return (
        <Layout user={props.user} title="국제바로병원 인트라넷" nav_id={32} crumbs={['공지사항', '중고거래게시판']}>
            <IntranetBoardPostList board_uid={16} />
        </Layout>
    );
};

export default IntranetMarket;
