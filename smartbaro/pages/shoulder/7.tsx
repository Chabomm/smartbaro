import type { GetServerSideProps, NextPage, NextPageContext } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import Seo from '@/components/Seo';
import { getAgentDevice, staticReplace } from '@/libs/utils';
import { api, setContext } from '@/libs/axios';

import SubMenuShoulder from '@/components/submenu/shoulder';

const shoulder_7: NextPage = (props: any) => {
    const nav_id = '/shoulder/7';
    const nav_name = '관절와순파열(SLAP)';
    const page_header = { nav_id: nav_id, sub_title: nav_name };

    return (
        <Layout title={nav_name} nav_id={nav_id} device={props.device}>
            <Seo title={nav_name} />
            <PageHeader params={page_header} device={props.device} />
            <Breadcrumb nav_id={nav_id} device={props.device} />
            <div dangerouslySetInnerHTML={{ __html: props.response }}></div>
            <SubMenuShoulder />
        </Layout>
    );
};
export const getServerSideProps: GetServerSideProps = async ctx => {
    setContext(ctx);
    const device = getAgentDevice(ctx);
    var request: any = { path: 'shoulder', name: '7.html' };
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

export default shoulder_7;
