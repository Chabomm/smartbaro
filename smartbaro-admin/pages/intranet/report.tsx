import type { NextPage } from 'next';
import React from 'react';
import Layout from '@/components/Layout';
import IntranetBoardPostList from './board/list';

const IntranetReport: NextPage = (props: any) => {
    return (
        <Layout user={props.user} title="국제바로병원 인트라넷" nav_id={39} crumbs={['자유게시판', '직원업무보고']}>
            <IntranetBoardPostList board_uid={22} />
        </Layout>
    );
};

export default IntranetReport;
