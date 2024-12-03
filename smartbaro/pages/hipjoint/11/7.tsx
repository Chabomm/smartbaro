import type { GetServerSideProps, NextPage } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import Seo from '@/components/Seo';
import { getAgentDevice, staticReplace } from '@/libs/utils';
import { api, setContext } from '@/libs/axios';

import TabNavi from '@/components/TabNavi';

const Hipjont_11_6: NextPage = (props: any) => {
    const nav_id = '/hipjoint/11/7';
    const nav_name = '척추측만증 변형수술';
    const page_header = { nav_id: nav_id, sub_title: nav_name };

    return (
        <Layout title={nav_name} nav_id={nav_id} device={props.device}>
            <Seo title={nav_name} />
            <PageHeader params={page_header} device={props.device} />
            <Breadcrumb nav_id={nav_id} device={props.device} />

            <div className="subject sub-py">{nav_name}</div>
            <TabNavi nav_id={nav_id} tab_gubun={'knee_center'} />
            <div dangerouslySetInnerHTML={{ __html: props.response }}></div>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    setContext(ctx);
    const device = getAgentDevice(ctx);
    var request: any = { path: 'hipjoint/11/', name: '7.html' };
    var response: any = {};
    try {
        const { data } = await api.get(`/resource/html/${request.path}/${request.name}`);
        response = staticReplace(data, ctx);
    } catch (e: any) {
        if (typeof e.redirect !== 'undefined') {
            return { redirect: e.redirect };
        }
    }
    return {
        props: { request, response, device: device },
    };
};

export default Hipjont_11_6;
