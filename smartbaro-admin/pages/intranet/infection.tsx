import type { NextPage } from 'next';
import React from 'react';
import Layout from '@/components/Layout';
import IntranetBoardPostList from './board/list';

const IntranetInfection: NextPage = (props: any) => {
    return (
        <Layout user={props.user} title="국제바로병원 인트라넷" nav_id={20} crumbs={['공지사항', '감염관리']}>
            <IntranetBoardPostList board_uid={13} />
        </Layout>
    );
};

export default IntranetInfection;
