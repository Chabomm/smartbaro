import type { GetServerSideProps, NextPage } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import Seo from '@/components/Seo';
import { getAgentDevice, staticReplace } from '@/libs/utils';
import { api, setContext } from '@/libs/axios';
import Link from 'next/link';

const Medical_3_index: NextPage = (props: any) => {
    const nav_id = '/medical/3';
    const nav_name = '제증명서류발급';
    const page_header = { nav_id: nav_id, sub_title: nav_name };

    return (
        <Layout title={nav_name} nav_id={nav_id} device={props.device}>
            <Seo title={nav_name} />
            <PageHeader params={page_header} device={props.device} />
            <Breadcrumb nav_id={nav_id} device={props.device} />

            <div className="hidden">
                <div className="flex-col justify-between h-40 hover:bg-slate-300 cursor-pointer mt-24 divide-x"></div>
                <div className="underline pt-20"></div>
            </div>

            <div dangerouslySetInnerHTML={{ __html: props.response }}></div>

            <section className="bg-section-gray padding-y">
                <div className="white-box site-width">
                    <div className="section_subject">안내 및 문의</div>
                    <div className="subject2 !py-0 text-point font-bold">032)722-8650</div>
                    <div className="subject2 !py-0 font-bold">담당자 : 원무과(서류발급담당)</div>
                    <div className="button-group grid-cols-2 mt-10">
                        <Link href={`/medical/3/list`}>
                            <div className="reserve-btn" style={{ backgroundColor: '#e5e5e5' }}>
                                진행사항 확인
                            </div>
                        </Link>
                        <button className="reserve-btn bg-second text-white">
                            <Link href={`/medical/3/reg`}>의무기록 사본 발급</Link>
                        </button>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    setContext(ctx);
    const device = getAgentDevice(ctx);
    var request: any = { path: 'medical/3/', name: 'index.html' };
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

export default Medical_3_index;
