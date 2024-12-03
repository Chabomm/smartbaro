import type { NextPage } from 'next';
import React from 'react';
import Layout from '@/components/Layout';
import IntranetBoardPostList from './board/list';

const IntranetNotice: NextPage = (props: any) => {
    return (
        <Layout user={props.user} title="국제바로병원 인트라넷" nav_id={18} crumbs={['공지사항', '공지사항']}>
            <IntranetBoardPostList board_uid={11} />
        </Layout>
    );
};

export default IntranetNotice;
