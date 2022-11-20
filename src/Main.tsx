import Page from "components/Page";
import { useNavigate } from "react-router";

const Main = () => {
    const navigate = useNavigate();
    return (
        <Page>
            <img src="/poster.png" alt="Poster of X(P, P)" />
            <div style={{ flexGrow: 1 }} />
            <button type="button" className="highlight" onClick={() => alert("준비 중입니다!")}>
                작품 설명
            </button>
            <button type="button" className="highlight" onClick={() => navigate("/test?result=true")}>
                상평형도 테스트
            </button>
            <div className="row">
                <button type="button" onClick={() => navigate("/present")}>
                    프로젝터
                </button>
                <button type="button" onClick={() => navigate("/control?room=solid")}>
                    체험자
                </button>
            </div>
        </Page>
    );
};
export default Main;
