const SubMenuScreening = (props: any) => {
    return (
        <section className="site-width padding-y">
            <div className="contents-width">
                <div className="section_subject ">
                    <div>국제바로병원</div>
                    <div>
                        <b>무릎관절센터 치료정보</b>
                    </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-10 text-center">
                    <div className="border card_box">
                        <a href="/knee/8/1">
                            <div className="overflow-hidden">
                                <img src="/resource/images/knee/desktop/CK_wmtg253066.png" alt="" className="transition hover:duration-500 hover:scale-125" />
                            </div>
                            <div className="sub_menu_title">로봇인공관절 수술</div>
                            <div className="py-2 card_link" style={{ background: '#707070', color: '#ffffff' }}>
                                자세한 내용 보기
                            </div>
                        </a>
                    </div>
                    <div className="border card_box">
                        <a href="/knee/8/3">
                            <div className="overflow-hidden">
                                <img src="/resource/images/knee/desktop/CK_wmtg253066.png" alt="" className="transition hover:duration-500 hover:scale-125" />
                            </div>
                            <div className="sub_menu_title">전후방십자인대 재건수술</div>
                            <div className="py-2 card_link" style={{ background: '#707070', color: '#ffffff' }}>
                                자세한 내용 보기
                            </div>
                        </a>
                    </div>
                    <div className="border card_box">
                        <a href="/knee/8/4">
                            <div className="overflow-hidden">
                                <img src="/resource/images/knee/desktop/CK_wmtg253066.png" alt="" className="transition hover:duration-500 hover:scale-125" />
                            </div>
                            <div className="sub_menu_title">연골판 줄기세포치료술</div>
                            <div className="py-2 card_link" style={{ background: '#707070', color: '#ffffff' }}>
                                자세한 내용 보기
                            </div>
                        </a>
                    </div>
                    <div className="border card_box">
                        <a href="/knee/8/5">
                            <div className="overflow-hidden">
                                <img src="/resource/images/knee/desktop/CK_wmtg253066.png" alt="" className="transition hover:duration-500 hover:scale-125" />
                            </div>
                            <div className="sub_menu_title">1day 관절내시경수술</div>
                            <div className="py-2 card_link" style={{ background: '#707070', color: '#ffffff' }}>
                                자세한 내용 보기
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SubMenuScreening;
