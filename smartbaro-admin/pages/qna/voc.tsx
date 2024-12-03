import type { NextPage } from 'next';
import React from 'react';
import Layout from '@/components/Layout';
import IntranetBoardPostList from '@/pages/intranet/board/list';

const QnaConsult: NextPage = (props: any) => {
    return (
        <Layout user={props.user} title="국제바로병원 인트라넷" nav_id={28} crumbs={['병원관리', '고객의 소리']}>
            <IntranetBoardPostList board_uid={10} />
        </Layout>
    );
};

export default QnaConsult;
