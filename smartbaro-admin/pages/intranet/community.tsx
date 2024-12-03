import type { NextPage } from 'next';
import React from 'react';
import Layout from '@/components/Layout';
import IntranetBoardPostList from './board/list';

const IntranetCommunity: NextPage = (props: any) => {
    return (
        <Layout user={props.user} title="국제바로병원 인트라넷" nav_id={31} crumbs={['공지사항', '자유게시판']}>
            <IntranetBoardPostList board_uid={15} />
        </Layout>
    );
};

export default IntranetCommunity;
