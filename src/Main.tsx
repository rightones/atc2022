import Page from "components/Page";
import { useNavigate } from "react-router";

const Main = () => {
    const navigate = useNavigate();
    return (
        <Page>
            <img src="/poster.png" alt="Poster of X(P, P)" style={{ width: "100%" }} />
            <button type="button" onClick={() => navigate("/present")}>
                작품 설명
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
