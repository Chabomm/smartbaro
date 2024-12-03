const SubMenuShoulder = (props: any) => {
    return (
        <section className="site-width padding-y">
            <div className="contents-width">
                <div className="section_subject ">
                    <div>국제바로병원</div>
                    <div>
                        <b>어깨관절센터 치료정보</b>
                    </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-10 text-center">
                    <div className="border card_box">
                        <a href="/shoulder/8/1">
                            <div className="sub_menu_title">역행성인공관절 수술</div>
                            <div className="py-2 card_link" style={{ background: '#707070', color: '#ffffff' }}>
                                자세한 내용 보기
                            </div>
                        </a>
                    </div>
                    <div className="border card_box">
                        <a href="/shoulder/8/2">
                            <div className="sub_menu_title">회전근개 이열봉합술</div>
                            <div className="py-2 card_link" style={{ background: '#707070', color: '#ffffff' }}>
                                자세한 내용 보기
                            </div>
                        </a>
                    </div>
                    <div className="border card_box">
                        <a href="/shoulder/8/3">
                            <div className="sub_menu_title">견봉석회화성형술</div>
                            <div className="py-2 card_link" style={{ background: '#707070', color: '#ffffff' }}>
                                자세한 내용 보기
                            </div>
                        </a>
                    </div>
                    <div className="border card_box">
                        <a href="/shoulder/8/4">
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

export default SubMenuShoulder;
