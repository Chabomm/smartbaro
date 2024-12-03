import type { NextPage } from 'next';
import React from 'react';
import Layout from '@/components/Layout';
import IntranetBoardPostList from './board/list';

const IntranetSafety: NextPage = (props: any) => {
    return (
        <Layout user={props.user} title="국제바로병원 인트라넷" nav_id={19} crumbs={['공지사항', '환자안전사고 게시판']}>
            <IntranetBoardPostList board_uid={12} />
        </Layout>
    );
};

export default IntranetSafety;
