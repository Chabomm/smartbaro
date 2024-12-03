import type { GetServerSideProps, NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import Seo from '@/components/Seo';
import { getAgentDevice, staticReplace } from '@/libs/utils';
import { api, setContext } from '@/libs/axios';

const Company_2: NextPage = (props: any) => {
    const nav_id = '/company/2';
    const nav_name = '국제바로병원 역사관';
    const page_header = { nav_id: nav_id, sub_title: nav_name };

    const [posts, setPosts] = useState<any>([]);

    useEffect(() => {
        if (JSON.stringify(props) !== '{}') {
            setPosts(props.response);
        }
    }, [props]);

    return (
        <Layout title={nav_name} nav_id={nav_id} device={props.device}>
            <Seo title={nav_name} />
            <PageHeader params={page_header} device={props.device} />
            <Breadcrumb nav_id={nav_id} device={props.device} />
            {/* <div dangerouslySetInnerHTML={{ __html: props.response }}></div> */}

            <div className="hidden w-2/4 self-end items-end ms-[50%] ms-[100%] w-[50%] font-bold"></div>

            <section className="site-width padding-y">
                <div className="subject mb-20">국제바로병원 역사관</div>
                {props.device == 'desktop'
                    ? posts?.map((v: any, i: number) => (
                          <div key={'wrap_' + i} className="hisyory-row desktop">
                              {i % 2 == 0 ? (
                                  <>
                                      <div className="left-item">
                                          <div className="year">{v.year}</div>
                                          <div className="text-box">
                                              {v?.texts?.map((vv: any, ii: number) => (
                                                  <div className={vv.class}>{vv.text}</div>
                                              ))}
                                          </div>
                                      </div>
                                      <div className="bar-wrap">
                                          <div className="bar-box">
                                              <div className="bar-circle"></div>
                                              <div className="bar-line"></div>
                                          </div>
                                      </div>
                                      <div className="right-item">
                                          <div className="grid grid-cols-2 gap-3">
                                              {v?.images?.map((vv: any, ii: number) => (
                                                  <>
                                                      <img src={vv.src} className={vv.class} style={{ height: 'fit-content' }} />
                                                  </>
                                              ))}
                                          </div>
                                      </div>
                                  </>
                              ) : (
                                  <>
                                      <div className="left-item">
                                          <div className="img-box">
                                              {v?.images?.map((vv: any, ii: number) => (
                                                  <>
                                                      <img src={vv.src} className={vv.class} style={{ height: 'fit-content' }} />
                                                  </>
                                              ))}
                                          </div>
                                      </div>
                                      <div className="bar-wrap">
                                          <div className="bar-box">
                                              <div className="bar-circle"></div>
                                              <div className="bar-line"></div>
                                          </div>
                                      </div>
                                      <div className="right-item">
                                          <div className="year">{v.year}</div>
                                          <div className="text-box">
                                              {v?.texts?.map((vv: any, ii: number) => (
                                                  <div className={vv.class}>{vv.text}</div>
                                              ))}
                                          </div>
                                      </div>
                                  </>
                              )}
                          </div>
                      ))
                    : posts?.map((v: any, i: number) => (
                          <div key={'wrap_' + i} className="hisyory-row mobile">
                              <div className="bar-wrap">
                                  <div className="bar-box">
                                      <div className="bar-circle"></div>
                                      <div className="bar-line"></div>
                                  </div>
                              </div>
                              <div className="item">
                                  <div className="year">{v.year}</div>
                                  <div className="img-box">
                                      {v?.images?.map((vv: any, ii: number) => (
                                          <>
                                              <img src={vv.src} className={vv.class} style={{ height: 'fit-content' }} />
                                          </>
                                      ))}
                                  </div>
                                  <div className="text-box">
                                      {v?.texts?.map((vv: any, ii: number) => (
                                          <div className={vv.class}>{vv.text}</div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      ))}
            </section>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    setContext(ctx);
    const device = getAgentDevice(ctx);
    var request: any = { path: 'company', name: '2.html' };
    var response: any = {};
    try {
        const { data } = await api.get(`/resource/html/company/history.json`);
        // response = staticReplace(data, ctx);
        response = data;
    } catch (e: any) {
        if (typeof e.redirect !== 'undefined') {
            return { redirect: e.redirect };
        }
    }
    return {
        props: { request, response, device: device },
    };
};

export default Company_2;
