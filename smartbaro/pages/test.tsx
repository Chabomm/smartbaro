import type { NextPage, NextPageContext } from 'next';
import React, { useEffect, useState } from 'react';
import { api } from '@/libs/axios';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Seo from '@/components/Seo';
import { checkNumeric, getAgentDevice } from '@/libs/utils';
import Image from 'next/image';

const Test: NextPage = (props: any) => {
    const router = useRouter();
    const [data, setData] = useState<any>({});

    useEffect(() => {}, []);

    useEffect(() => {
        getMainJson();
    }, []);

    const getMainJson = async () => {
        try {
            const { data } = await api.get(`/resource/main/MAIN.json?${Math.floor(Date.now() / 1000)}`, {});
            setData(data);
        } catch (e) {}
    };

    return (
        <div className="w-full flex gap-3 flex-col">
            <div>
                <img src="https://resr.smartbaro.com/main/banner/70b940d5-f51c-481f-8b03-c99fd7e79116.jpg" alt="" />
            </div>
            <div>
                <div className=" grid grid-cols-2">
                    <div></div>
                    <Image
                        sizes="100vw"
                        style={{
                            width: '100%',
                            height: 'auto',
                        }}
                        src="https://resr.smartbaro.com/main/banner/70b940d5-f51c-481f-8b03-c99fd7e79116.jpg"
                        alt=""
                        fill
                    />
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps = async (ctx: NextPageContext) => {
    return {
        props: { device: getAgentDevice(ctx) },
    };
};

export default Test;
