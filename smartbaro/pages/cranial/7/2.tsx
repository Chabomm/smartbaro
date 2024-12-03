import type { GetServerSideProps, NextPage } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import Seo from '@/components/Seo';
import { getAgentDevice, staticReplace } from '@/libs/utils';
import { api, setContext } from '@/libs/axios';

import TabNavi from '@/components/TabNavi';

const Cranial_7_2: NextPage = (props: any) => {
    const nav_id = '/cranial/7/2';
    const nav_name = '고주파수핵감압술';
    const page_header = { nav_id: nav_id, sub_title: nav_name };

    return (
        <Layout title={nav_name} nav_id={nav_id} device={props.device}>
            <Seo title={nav_name} />
            <PageHeader params={page_header} device={props.device} />
            <Breadcrumb nav_id={nav_id} device={props.device} />

            <div className="subject sub-py">{nav_name}</div>
            <TabNavi nav_id={nav_id} />
            <div dangerouslySetInnerHTML={{ __html: props.response }}></div>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    setContext(ctx);
    const device = getAgentDevice(ctx);
    var request: any = { path: 'cranial/7/', name: '2.html' };
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

export default Cranial_7_2;
