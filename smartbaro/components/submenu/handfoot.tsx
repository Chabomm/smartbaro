const SubMenuHandfoot = (props: any) => {
    return (
        <section className="site-width padding-y">
            <div className="contents-width">
                <div className="section_subject ">
                    <div>국제바로병원</div>
                    <div>
                        <b>수부/족부 치료정보</b>
                    </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-10 text-center">
                    <div className="border card_box">
                        <a href="/handfoot/11/2">
                            <div className="sub_menu_title">수근관터널증후군 수술</div>
                            <div className="py-2 card_link" style={{ background: '#707070', color: '#ffffff' }}>
                                자세한 내용 보기
                            </div>
                        </a>
                    </div>
                    <div className="border card_box">
                        <a href="/handfoot/11/3">
                            <div className="sub_menu_title">아킬레스파열 재건수술</div>
                            <div className="py-2 card_link" style={{ background: '#707070', color: '#ffffff' }}>
                                자세한 내용 보기
                            </div>
                        </a>
                    </div>
                    <div className="border card_box">
                        <a href="/handfoot/11/4">
                            <div className="sub_menu_title">전거비인대파열 수술</div>
                            <div className="py-2 card_link" style={{ background: '#707070', color: '#ffffff' }}>
                                자세한 내용 보기
                            </div>
                        </a>
                    </div>
                    <div className="border card_box">
                        <a href="/handfoot/11/5">
                            <div className="sub_menu_title">무지외반증수술</div>
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

export default SubMenuHandfoot;
