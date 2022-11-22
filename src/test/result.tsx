import { useEffect } from "react";
import { HiChevronDoubleDown } from "react-icons/hi2";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

type ResultKey = "S" | "S-L" | "L-S" | "L" | "L-G" | "G-L" | "G";

type ResultData = {
    [key in ResultKey]: {
        title: string;
        description: string;
        x: number;
        y: number;
    };
};

const data: ResultData = {
    S: {
        title: "압박이 강한 고체",
        description:
            "바쁜 현생에 지친 당신은 강한 압박에 깨지기 직전인 ‘고체 상태’입니다. 지치고 피로한 하루 끝, 당신을 버티게 하는 것은 스마트폰과 커피 뿐…\n\n전자기기를 충전하는 것처럼, 당신도 충전을 통해 고체상태에서 벗어날 에너지가 필요합니다. 당신이 고체 상태에 멈추어 있는 것은 당신만의 잘못이 아닙니다. 당신에게 스트레스를 주는 주위의 압박 하에 너무 오래 방치된 나머지 당신은 이를 극복할 에너지를 잃을 정도로 지쳤을 뿐입니다. 그러니 자책하지 말고 스스로를 더 아껴주세요.",
        x: 15,
        y: 80,
    },
    "S-L": {
        title: "압박이 비교적 약한 고체",
        description:
            "당신은 지쳐있지만, 충분히 상황을 헤쳐나갈 에너지도 가지고 있습니다. 당신을 괴롭게 하는 일이 있어도, 지금처럼 꾸준히 노력한다면 당신을 둘러싼 압박을 열정으로 녹여내고 변화할 수 있습니다.\n\n노력하는 과정이 지치고 힘들더라도, 당신을 믿고 앞으로 나아가세요.",
        x: 35,
        y: 45,
    },
    "L-S": {
        title: "압박이 비교적 높은 액체",
        description:
            "당신의 열정은 주위의 압박과 평형을 이루고 있지만, 당신은 번아웃을 조심해야 합니다.\n\n스트레스 관리, 자신을 돌보는 일을 소홀히 한 채로 무리하게 일을 진행하게 되면 당신은 곧 에너지를 모두 소진하고 말 것입니다. 물질의 상변화에 큰 에너지가 필요하듯이, 당신 역시 번아웃을 극복하기 위해서는 오랜 시간과 큰 에너지가 필요할 수 있습니다. 가끔은 쉬면서 자신만의 시간을 가져보세요.",
        x: 45,
        y: 85,
    },
    L: {
        title: "액체",
        description:
            "당신은 보통의 사람들처럼 삶을 영위할 수 있는 적당한 에너지와 압박을 느끼고 있습니다. 당신에게 주어진 일을 잘 수행하며, 원만한 대인관계를 유지할 수 있습니다.\n\n잘 해내고 있지만, 주어진 일을 처리하는 것에서 나아가 당신이 진정으로 좋아하는 것이 무엇인지, 즐겁고 잘하는 것은 무엇인지 성찰하는 시간을 가져보세요. 주도적이고 자율적인 삶으로 한 발짝 나아갈 수 있을 것입니다.",
        x: 50,
        y: 60,
    },
    "L-G": {
        title: "열정이 비교적 높은 액체",
        description:
            "당신은 원하는 것을 찾기 위한 도약을 하고 있습니다. 아직 무엇을 하고 싶은 지 확신할 수는 없지만, 지금과 같은 충분한 열정과 함께라면 당신의 도전을 이어나갈 수 있습니다.\n\n쉽게 지치거나 도전 끝의 결과에 낙담하지 않는 당신은, 이 과정을 발전의 초석으로 삼아 더욱 성장할 수 있습니다.",
        x: 75,
        y: 70,
    },
    "G-L": {
        title: "압박과 열정 차이가 크지 않은 기체",
        description:
            "좋아하는 일을 하며, 주위에 목소리를 낼 줄 아는 당신은 삶을 충분히 주체적으로 이끌어가고 있습니다.\n\n당신은 여전히 충분한 열정을 가지고 있지만, 현재의 삶에 안주하고 새로움을 찾지 않으면 도전하려는 마음과 열정을 잃고 말 것입니다. 물질의 상변화에 큰 에너지가 필요하듯이, 당신 역시 자율적인 삶을 되찾기 위해 많은 노력을 들여야 합니다. 가끔은 쉬면서 자신만의 시간을 가져보세요.",
        x: 50,
        y: 20,
    },
    G: {
        title: "열정이 비교적 높은 기체",
        description:
            "당신은 열정 넘치는 상태로, 자신에게 주어진 자유를 충분히 누릴 수 있는 상태입니다.\n\n그리고 어떤 일이든 해낼 수 있다는 자신감을 가지고 있어, 당신의 자유와 열정을 바탕으로 어떤 일이든 추진력 있게 진행할 수 있습니다. 그러나 가끔씩은 당신의 자유가 남에게 어떤 영향을 미치는지를 되돌아볼 필요가 있습니다. 의욕이 앞서나가는 상황을 경계하고 주위에도 눈길을 돌린다면, 당신은 세상에 더욱 긍정적인 영향을 줄 것입니다.",
        x: 75,
        y: 30,
    },
};

const Container = styled.div`
    color: white;
    word-break: keep-all;
    word-wrap: break-word;
    white-space: pre-wrap;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    p {
        line-height: 1.6;
    }

    h1,
    h2 {
        text-align: center;
        margin: 0 auto;
    }

    h1 {
        font-size: 4rem;
        color: rgb(255, 100, 100);
    }

    main {
        padding: 20px;
        & > * {
            max-width: 480px;
            margin-right: auto;
            margin-left: auto;
        }
        hr {
            margin: 30px auto;
            opacity: 0.1;
        }
        p {
            margin: 30px auto;
        }
    }

    footer {
        padding: 20px;
        background-color: #111;
        flex-grow: 1;
        & > * {
            max-width: 480px;
            margin-right: auto;
            margin-left: auto;
        }
    }

    button {
        border: none;
        height: 48px;
        width: 100%;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 500;
        transition: background-color 200ms ease-in-out;

        background-color: rgba(255, 255, 255, 0.1);
        color: white;

        &.active {
            background-color: white;
            color: black;
        }

        &.hidden {
            background-color: black;
            color: #fff6;
        }
    }
`;

const TestResultPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const type = searchParams.get("type") as ResultKey | null;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [searchParams]);

    return (
        <Container>
            <video
                autoPlay
                loop
                muted
                playsInline
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
            {type ? (
                <main>
                    <div style={{ position: "relative" }}>
                        <img src="/web.svg" />
                        <div
                            style={{
                                position: "absolute",
                                borderRadius: "12px",
                                width: "12px",
                                height: "12px",
                                backgroundColor: "rgb(255, 100, 100)",
                                left: `${data[type].x}%`,
                                bottom: `${data[type].y}%`,
                            }}
                        />
                    </div>
                    <h2>당신의 유형은</h2>
                    <h1>{type}</h1>
                    <h2>({data[type]?.title})</h2>
                    <hr />
                    <p>{data[type]?.description}</p>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            marginTop: "60px",
                            opacity: 0.5,
                        }}
                    >
                        <span>아래에 계속</span>
                        <HiChevronDoubleDown />
                    </div>
                </main>
            ) : (
                <main>
                    <h2 style={{ margin: "20px auto" }}>아래에서 다시 확인하고 싶은 유형을 선택하세요.</h2>
                </main>
            )}
            <footer>
                <p>
                    16개의 MBTI로 모든 사람들을 분류할 수 없듯이, 인간을 특정 상으로 정의내릴 수는 없습니다. 우리는
                    X(열정, 압박)을 통해 이러한 유형화에서 벗어나 개개인의 차이와 가치의 존중을 전하려고 합니다.
                </p>
                <p>
                    사람들의 다양성은 독립적인 결과가 아닙니다. 우리는 사회 속에서 서로 부딪히며 살아감으로 인해
                    서로에게 영향을 주게 됩니다. 개인에게 문제가 생겼다고 자책할 필요가 없고, 어쩌면 사회적 문제에 내
                    책임이 있지는 않은지 고민해보아야 할 이유가 이 때문입니다.
                </p>
                <p>
                    그러니 서로가 영향을 주는 이 사회에서 자신의 고유한 모습을 알고, 가꾼다면 그 자체로 당신은 가치있는
                    ‘상’이 될 것입니다.
                </p>
                {searchParams.get("event") && (
                    <p style={{ padding: "12px 16px", backgroundColor: "white", color: "black", borderRadius: "12px" }}>
                        전시의 모든 단계가 완료되었습니다. 감사합니다.
                        <br />
                        밖으로 나와서 단말기와 헤드폰을 반납해주세요.
                    </p>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", margin: "32px auto" }}>
                    {Object.keys(data).map((key) => (
                        <button
                            onClick={() =>
                                navigate(`/test/result?type=${key}&event=${searchParams.get("event") ?? ""}`)
                            }
                            className={type === key ? "active" : ""}
                        >
                            {key}
                        </button>
                    ))}
                </div>
                {searchParams.get("event") && (
                    <button className="hidden" onClick={() => navigate(`/control`)} style={{ marginTop: "40px" }}>
                        다시 시작(관리용)
                    </button>
                )}
            </footer>
        </Container>
    );
};

export default TestResultPage;
