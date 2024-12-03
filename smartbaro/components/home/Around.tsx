export default function Around({ go_next_page, device }: any) {
    return (
        <div>
            <section className="around-floor" style={{ backgroundImage: `url(/resource/images/main/desktop/main_bg-02.png)` }}>
                <div className="site-width text-white text-center">
                    <div className="main_sub_tit pb-2.5">FLOOR INFORMATION</div>
                    <div className="subject pb-18">
                        <span className="font-normal">국제바로병원</span> 층별안내
                    </div>
                    <div className="txt-box">
                        국제바로병원은 늘 처음과 같은 마음을 잊지 않고
                        <br /> 전 국민의 관절과 척추가 바로서는 그날까지 언제나 노력합니다.
                    </div>
                    <button
                        onClick={e => {
                            go_next_page('/company/5');
                        }}
                    >
                        <div className="btn-go hover:bg-white hover:text-black">
                            층별 안내 보러가기
                            <i className="fas fa-chevron-right ms-3"></i>
                        </div>
                    </button>
                </div>
            </section>
        </div>
    );
}
