import Page from "components/Page";
import { useNavigate } from "react-router";

const Main = () => {
    const navigate = useNavigate();
    return (
        <Page>
            <button onClick={() => navigate("/present")}>서버 연결(프로젝터)</button>
            <button onClick={() => navigate("/control?room=solid")}>서버 연결(체험자)</button>
        </Page>
    );
};
export default Main;
