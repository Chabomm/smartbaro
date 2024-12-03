import { checkNumeric, cls } from '@/libs/utils';
import React, { useState, useEffect } from 'react';

export default function ListPagenation({ props, getPagePost, device }: any) {
    const class_prev = 'class_prev focus:z-20 focus:outline-offset-0';

    const class_next = 'class_next focus:z-20 focus:outline-offset-0';

    const class_page = 'class_page hover:bg-gray-50 focus:z-20 focus:outline-offset-0';

    const class_page_on =
        'class_page z-10 inline-flex bg-second !text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';

    const class_divider = 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 focus:outline-offset-0';
    const page_count = [...Array(checkNumeric(props?.page_last))];

    // [ S ] count_page
    let startPage: any;
    let endPage: any;
    let count_page: any = [{ num: 1, active: 'active' }];
    if (checkNumeric(props?.page_last) <= 10) {
        startPage = 1;
        endPage = page_count.length;

        let show_page: any = [];
        for (let i = startPage; i <= endPage; i++) {
            let setPage: any = {};
            if (i == checkNumeric(props?.page)) {
                setPage.active = 'active';
            } else {
                setPage.active = 'No';
            }
            setPage.num = i;
            show_page.push(setPage);
        }
        count_page = show_page;
    } else {
        if (checkNumeric(props?.page) - 4 <= 1) {
            startPage = 1;
        } else {
            startPage = checkNumeric(props?.page) - 4;
        }

        if (checkNumeric(props?.page) + 5 >= checkNumeric(props?.page_last)) {
            endPage = checkNumeric(props?.page_last);
        } else {
            if (checkNumeric(props?.page) <= 5) {
                endPage = 10;
            } else {
                endPage = checkNumeric(props?.page) + 5;
            }
        }

        let show_page: any = [];
        for (let i = startPage; i <= endPage; i++) {
            let setPage: any = {};
            if (i == checkNumeric(props?.page)) {
                setPage.active = 'active';
            } else {
                setPage.active = 'No';
            }
            setPage.num = i;
            show_page.push(setPage);
        }
        count_page = show_page;
    }
    // [ E ] count_page

    const change_page = (page: number) => {
        if (page > 0 && page <= checkNumeric(props?.page_last)) {
            props.page = page;
            getPagePost(props);
        }
    };

    return (
        <div className="py-3 w-full mt-10">
            <div className="flex flex-1 items-center justify-center">
                <div className="pag-wrap -space-x-px">
                    <div
                        className={class_prev}
                        onClick={() => {
                            change_page(1);
                        }}
                    >
                        <span className="">{device == 'desktop' ? '맨처음' : '<<'}</span>
                    </div>
                    <div
                        className={class_prev}
                        onClick={() => {
                            change_page(checkNumeric(props?.page) - 1);
                        }}
                    >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path
                                fillRule="evenodd"
                                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    {count_page.map((v: any, i: number) => (
                        <div
                            key={i}
                            className={cls(v.active == 'active' ? class_page_on : class_page)}
                            onClick={() => {
                                change_page(v.num);
                            }}
                        >
                            {v.num}
                        </div>
                    ))}

                    <div
                        className={class_next}
                        onClick={() => {
                            change_page(checkNumeric(props?.page) + 1);
                        }}
                    >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path
                                fillRule="evenodd"
                                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div
                        className={class_prev}
                        onClick={() => {
                            change_page(checkNumeric(props?.page_last));
                        }}
                    >
                        <span className="">{device == 'desktop' ? '맨끝' : '>>'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
