import Breadcrumb from '@/components/Breadcrumb';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import Seo from '@/components/Seo';
import { FrameWrapper } from '@/components/UIcomponent/FrameWrapper';
import { getAgentDevice } from '@/libs/utils';
import { GetServerSideProps, NextPage } from 'next';

const Medical_5: NextPage = (props: any) => {
    const nav_id = '/medical/5';
    const nav_name = '비급여항목';
    const page_header = { nav_id: nav_id, sub_title: nav_name };
    return (
        <Layout title={nav_name} nav_id={nav_id} device={props.device}>
            <Seo title={nav_name} />
            <PageHeader params={page_header} device={props.device} />
            <Breadcrumb nav_id={nav_id} device={props.device} />
            <section className="py-28 site-width">
                <div className="subject mb-10">비급여항목</div>
                <div className="overflow-x-auto">
                    <FrameWrapper src={'https://www.hira.or.kr/re/diag/getNpayNotiCsuiSvcFom.do?yadmSbstKey=ay0CoYvMqSnLCL96' + (props.device == 'mobile' ? '&width=auto' : '')} />
                </div>
            </section>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    return {
        props: { device: getAgentDevice(ctx) },
    };
};

export default Medical_5;
