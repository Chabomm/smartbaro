import type { NextPage } from 'next';
import React from 'react';
import Layout from '@/components/Layout';
import IntranetBoardPostList from './board/list';

const IntranetFormula: NextPage = (props: any) => {
    return (
        <Layout user={props.user} title="국제바로병원 인트라넷" nav_id={21} crumbs={['공지사항', '서식자료실']}>
            <IntranetBoardPostList board_uid={14} />
        </Layout>
    );
};

export default IntranetFormula;
