import { useState } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

const data = [
    {
        title: "다른 사람의 나에 대한 평가에\n예민하게 반응하는 편이다",
        true: { solid: 2, liquid: 1, gas: 0 },
        false: { solid: 0, liquid: 1, gas: 3 },
    },
    {
        title: "나는 신경 쓸 곳이 너무 많다",
        true: { solid: 2, liquid: 2, gas: 1 },
        false: { solid: 0, liquid: 2, gas: 2 },
    },
    {
        title: "나는 나에게 충분한 보상이나 휴식 시간을 준다",
        true: { solid: 0, liquid: 2, gas: 3 },
        false: { solid: 2, liquid: 1, gas: 0 },
    },
    {
        title: "남들이 나에게 갓생을 산다고 말한다",
        footnote: "갓생은 부지런한 삶을 일컫는 신조어입니다.",
        true: { solid: 2, liquid: 2, gas: 1 },
        false: { solid: 2, liquid: 1, gas: 2 },
    },
    {
        title: "나는 무슨 일이든 할 수 있을 것이라는 믿음이 있다",
        true: { solid: 0, liquid: 1, gas: 3 },
        false: { solid: 2, liquid: 1, gas: 0 },
    },
    {
        title: "나는 많은 꿈을 가지고 있다",
        true: { solid: 1, liquid: 1, gas: 1 },
        false: { solid: 2, liquid: 0, gas: 0 },
    },
];

const Container = styled.div`
    padding: 20px;
    color: white;
    display: flex;
    flex-direction: column;
    height: 100vh;
    box-sizing: border-box;

    word-break: keep-all;
    word-wrap: break-word;
    white-space: pre-wrap;

    video {
        pointer-events: none;
    }

    .question {
        text-align: center;
        margin: 140px 0;

        h1 {
            margin: 16px;
            font-size: 48px;
        }

        h2 {
            margin: 16px;
            font-size: 24px;
            font-weight: 500;
        }
    }

    .button {
        display: flex;
        flex-direction: row;
        gap: 16px;
        margin: 32px 0;
        button {
            font-size: 20px !important;
            font-weight: bold;
        }

        .select {
            height: 200px;
            background-color: rgba(255, 255, 255);
        }

        .noselect {
            height: 200px;
            background-color: rgba(255, 255, 255, 0.5);
        }
    }

    button {
        background-color: white;
        color: black;
        border: none;
        height: 48px;
        width: 100%;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 500;
        transition: background-color 200ms ease-in-out;

        &.highlight {
            background-color: #aadad5;
            color: #000;
        }

        :disabled {
            background-color: rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.3);
        }
    }
`;

const TestPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [state, setState] = useState(false);
    const [num, setNum] = useState(0);
    const [selectState, setSelectState] = useState<boolean | null>(null);
    const [solid, setSolid] = useState(0);
    const [liquid, setLiquid] = useState(0);
    const [gas, setGas] = useState(0);

    const handleNext = () => {
        if (selectState !== null) {
            if (num === 5) {
                let result = Object.entries({ S: solid, L: liquid, G: gas })
                    .sort((a, b) => a[1] - b[1])
                    .map(([key, value]) => (value >= 7 ? key : null))
                    .filter((v) => v !== null)
                    .join("-");
                if (result === "S-G") result = "S";
                if (result === "G-S") result = "G";
                navigate(`/test/result?type=${result}&event=${searchParams.get("event") ?? ""}`);
            } else {
                setSelectState(null);
                setLiquid((old) => old + data[num][String(selectState) as "true" | "false"].liquid);
                setSolid((old) => old + data[num][String(selectState) as "true" | "false"].solid);
                setGas((old) => old + data[num][String(selectState) as "true" | "false"].gas);
                setNum((old) => old + 1);
            }
        }
    };

    return (
        <Container>
            <video
                autoPlay
                loop
                muted
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                    zIndex: -1,
                    objectFit: "cover",
                    display: "block",
                    width: "100%",
                    height: "100%",
                }}
            >
                <source src="/background3.mov" />
            </video>
            {state ? (
                <>
                    <div className="question">
                        <h1>Q{num + 1}.</h1>
                        <h2>{data[num].title}</h2>
                    </div>
                    <div style={{ flexGrow: 1 }} />
                    <p>{data[num].footnote}</p>
                    <div className="button">
                        <button
                            className={selectState === true ? "select" : "noselect"}
                            onClick={() => setSelectState(true)}
                        >
                            예
                        </button>
                        <button
                            className={selectState === false ? "select" : "noselect"}
                            onClick={() => setSelectState(false)}
                        >
                            아니오
                        </button>
                    </div>
                    <button className="highlight" disabled={selectState === null} onClick={handleNext}>
                        다음
                    </button>
                </>
            ) : (
                <>
                    <h1>
                        여러분들의 상은
                        <br />
                        무엇인가요?
                    </h1>
                    <p>
                        이 테스트는 몇 질문을 통해
                        <br />
                        본인의 상이 어디에 속하는지 알아낼 수 있습니다.
                    </p>
                    <div style={{ flexGrow: 1 }} />
                    {searchParams.get("result") && (
                        <button onClick={() => navigate("/test/result")} style={{ marginBottom: "12px" }}>
                            유형 결과 보기
                        </button>
                    )}
                    <button className="highlight" onClick={() => setState(true)}>
                        시작
                    </button>
                </>
            )}
        </Container>
    );
};

export default TestPage;
