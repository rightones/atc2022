import { Update } from "@remix-run/router/history";
import Page from "components/Page";
import useControlSocket from "hooks/useControlSocket";
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
    HiXMark,
    HiBackward,
    HiBellAlert,
    HiChevronLeft,
    HiChevronRight,
    HiDocumentText,
    HiPlay,
    HiStop,
} from "react-icons/hi2";
import { NavigationType, UNSAFE_NavigationContext, useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";

type Room = "solid" | "liquid" | "gas" | "super";
type Prop = {
    [key in Room]: {
        image: string;
        title: string;
        description: string;
        script: string;
        next: string | null;
        nextTitle: string | null;
        preAudio: string;
        audio: string;
        shouldShowNextButtonAlways?: boolean;
        beforeTag?: string;
        beforeTagDescription?: string;
        afterTag?: string;
        afterTagDescription?: string;
        afterTagAudio?: string;
    };
};

const prop: Prop = {
    solid: {
        image: "/solid.png",
        title: "고체",
        description: "걷잡을 수 없는 사회의 압박 속에 사그라드는 열정. 몸도 마음도 딱딱하게 굳어버린 ‘현대판 노예’.",
        next: "liquid",
        nextTitle: "액체",
        preAudio: "/bgm.mov",
        audio: "/bgm.mov",
        script:
            "겉잡을 수 없는 사회의 압박 속에 사그라드는 열정. 몸도 마음도 딱딱하게 굳어버린 ‘현대판 노예’. 속절없이 흘러가는 시간 속, 온전히 자신을 위한 순간들은 뒤로 한 채 피로와 스트레스로 점철된 하루를 보냅니다. 자신의 충전보다 노트북, 휴대폰의 충전이 우선이 되어버린 노예들은 커피와 담배에 의존하며 연명하듯 살아갑니다.\n" +
            "\n" +
            "영상과 설치물을 함께 감상해보세요!",
    },
    liquid: {
        image: "/liquid.png",
        title: "액체",
        description:
            "사회적 압박과 내면의 열정의 적절한 균형 하에서 일상을 영위하는 평범한 사회인의 인간상을 보여준다.",
        next: "gas",
        nextTitle: "기체",
        preAudio: "/bgm.mov",
        audio: "/bgm.mov",
        beforeTag: "04:55:78:ea:c0:74:81",
        beforeTagDescription: "스크린 왼쪽 단말기에\n휴대폰을 태그해주세요.",
        afterTag: "04:6a:79:ea:c0:74:81",
        afterTagDescription: "스크린 오른쪽 단말기에\n휴대폰을 태그해주세요.",
        script: "사회적 압박과 내면의 열정의 적절한 균형을 맞추며 일상을 영위하는 보통의 사회인. ‘지하철’은 하루의 고단한 시작과 후련한 마무리가 함께하는 양가적 감정을 느낄 수 있는 공간인 동시에 사회 구성원으로서의 ‘나’를 바라볼 수 있는 공간입니다. 창 밖으로 보이는 물에 잠긴 도시의 모습은 고요하고 잠잠한 바다 속과 화려한 불빛들이 혼재되어 감각적이면서도 왠지 모를 공허한 감정을 불러 일으킵니다. 들고 계신 휴대폰을 단말기에 태그해보세요.   ",
    },
    gas: {
        image: "/gas.png",
        title: "기체",
        description:
            "사회적 압박으로부터 비교적 자유로워진 내면의 열정을 키움과 더불어 외부로 발산하며 커다란 영향력을 펼친다.",
        next: "super",
        nextTitle: "초임계유체",
        preAudio: "/bgm.mov",
        audio: "/bgm.mov",
        shouldShowNextButtonAlways: true,
        script: "자신의 자유를 충분히 누리며, 가득한 열정을 발휘하며 살아가는 현대인. 사회의 주어진 역할에서 벗어나, 자신의 일과 정체성을 스스로 찾아가는 과정에서 사람들은 마치 기체처럼 사회 전반으로 퍼져나가며 영향력을 행사합니다. 자유로운 인터렉션을 통해 자신만의 이미지를 찾아가는 과정에 앞으로 나아가야 할 방향과 정체성에 대한 생각을 담았습니다. 스크린을 등지고 서서 두 팔을 높이 들고 흔들어보세요!",
    },
    super: {
        image: "/super.png",
        title: "초임계유체",
        description: "",
        next: "test",
        nextTitle: "나의 상 테스트",
        preAudio: "/bgm.mov",
        audio: "/bgm.mov",
        beforeTag: "04:54:78:ea:c0:74:81",
        beforeTagDescription: "저울에 각 방에서 수집한 페이즈를 올려놔주세요.",
        script:
            "현대 사회는 다양한 ‘틀’을 통해 사람들을 유형화 합니다. 이러한 틀은 어떤 면에서는 편리하지만, 한 편으로는 변화를 제한하고 사람들을 구분짓게 합니다. 초임계유체는 액체와 기체의 특성을 모두 지니고 있지만 기체도, 액체도 아닌 독립적인 상입니다. 이러한 초임계유체처럼 사람은 그 ‘자체’로 특별한 상을 띠고 있습니다. 여러 상을 거쳐 초임계유체에 도달하는 과정을 통해, 어떤 것으로도 완벽하게 유형화할 수 없는 자기 자신을 하나의 새로운 상으로 인식하게 됩니다. \n" +
            "\n" +
            "저울 위에 각 방에서 가져온 페이즈들을 올려놓아 보세요.",
    },
};

function ControlPage() {
    const [state, setState] = useState(false);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [prevRoom, setPrevRoom] = useState<string | null>(null);
    const { on, off, help, setUrl, connectionState } = useControlSocket();
    const [preAudioState, setPreAudioState] = useState(false);
    const [audioState, setAudioState] = useState(false);
    const preAudioRef = useRef<HTMLAudioElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const [scriptPopup, setScriptPopup] = useState(false);

    const [nfcTag, setNfcTag] = useState<string | null>(null);

    const [urlInput, setUrlInput] = useState("localhost:4000");

    let room = searchParams.get("room");

    if (!room || !["solid", "liquid", "gas", "super"].includes(room)) {
        room = "solid";
    }
    const props = prop[room as Room];

    useLayoutEffect(() => {
        (async () => {
            if (typeof NDEFReader !== "undefined") {
                try {
                    const ndef = new NDEFReader();
                    await ndef.scan();
                    console.log("> Scan started");
                    ndef.addEventListener("reading", ({ message, serialNumber }: any): void => {
                        setNfcTag(serialNumber);
                    });
                } catch (error) {
                    alert(`Argh! ${error}`);
                }
            }
        })();
        const server = localStorage.getItem("server");
        if (server) {
            setUrl(server);
            setUrlInput(server);
        }
        window.onpopstate = () => {};
    }, []);

    useEffect(() => {
        if (connectionState) {
            setPrevRoom(room || "solid");
            off(room || "solid");
            setScriptPopup(false);

            return () => {
                // preAudioRef.current?.pause();

                preAudioRef.current?.setAttribute("currentTime", "0");
                audioRef.current?.setAttribute("currentTime", "0");
                audioRef.current?.pause();
                setPreAudioState(false);
                setAudioState(false);
            };
        }
    }, [searchParams, connectionState]);

    useEffect(() => {
        if (searchParams.get("url")) {
            setUrlInput(searchParams.get("url") as string);
        }
    }, [searchParams]);

    useEffect(() => {
        if (preAudioState && !audioState) {
            audioRef.current?.play();
            if (room) on(room);
        }
    }, [preAudioState]);

    useEffect(() => {
        if (!preAudioState && props.beforeTag && nfcTag === props.beforeTag) {
            setPreAudioState(true);
            preAudioRef.current?.pause();
        }
    }, [nfcTag]);

    const handleNext = () => {
        if (confirm("다음으로 넘어갈까요?")) {
            if (props.next === "test") {
                navigate(`/test?event=true`);
            } else {
                off(room || "solid");
                navigate(`/control?room=${props.next}`);
            }
        }
    };

    const handleHelp = () => {
        if (confirm("위급 상황인가요?")) {
            help();
        }
    };

    if (!connectionState || !state) {
        return (
            <>
                <Page>
                    <div>
                        <h3>기기 사용 방법</h3>
                        <p>
                            본 기기는 전시에 사용되는 소리와 나레이션을 들을 수 있으며, 전시의 안내 또한 같이 볼 수 있는
                            기기입니다.
                        </p>
                        <p>음성 안내에 따르며 체험하시면 됩니다.</p>
                        <p>본 기기의 화면은 끄지 마시고, 화면이 켜진 상태에서 계속 손에 든 채로 체험하시면 됩니다.</p>
                        <p>각 방에서 체험이 완료되면 기기에 있는 "다음" 버튼을 누르고 다음 방으로 이동하시면 됩니다.</p>
                    </div>
                    <div>
                        <h3>전시 중 유의사항</h3>
                        <p>전시장 내부가 어둡기 때문에, 바닥에 부착된 안내선을 따라 주의하며 이동해주세요.</p>
                        <p>플래시가 필요한 경우 기기 오른쪽 전원 버튼을 길게 눌러서 켜거나 끌 수 있습니다.</p>
                        <p>
                            본 전시는 프로젝터를 다량으로 사용합니다. 얼굴에 약하게 쏘이는 상황도 존재할 수 있으니 빛에
                            민감하거나 안구가 좋지 않은 경우 미리 확인 부탁드립니다.
                        </p>
                        <p>체험 중 위급 상황이 발생한 경우, 기기 아래에 있는 도움 요청 버튼을 눌러주세요.</p>
                    </div>
                    <div>
                        <h3>음량 테스트</h3>
                        <audio controls style={{ width: "100%" }}>
                            <source src="/bgm.mp3" />
                        </audio>
                    </div>
                    <div style={{ flexGrow: 1 }} />
                    <div>
                        <h3>{connectionState ? "서버에 연결되어 있습니다." : "서버에 연결되어 있지 않습니다."}</h3>
                    </div>
                    <div>
                        <button
                            className="highlight"
                            disabled={!connectionState}
                            onClick={() => {
                                if (connectionState) setState(true);
                            }}
                        >
                            시작
                        </button>
                    </div>
                </Page>
                <Page>
                    <div>
                        <h3>서버 주소</h3>
                        <input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="주소" />
                    </div>
                    <div>
                        <button
                            className="highlight"
                            onClick={() => {
                                if (connectionState) setUrl("");
                                else {
                                    localStorage.setItem("server", urlInput);
                                    setUrl(urlInput);
                                }
                            }}
                        >
                            {connectionState ? "연결 해제" : "연결"}
                        </button>
                    </div>
                </Page>
            </>
        );
    }

    return (
        <Page>
            <img src={props.image} />
            <h1>{props.title}</h1>
            <div>{props.description}</div>
            <div style={{ flexGrow: 1 }} />
            <button onClick={() => setScriptPopup(true)}>
                나레이션 스크립트
                <HiChevronRight />
            </button>
            <audio
                src={props.preAudio}
                key={`${room}pre`}
                hidden
                autoPlay
                loop={false}
                ref={preAudioRef}
                onEnded={() => {
                    if (!props.beforeTag) setPreAudioState(true);
                }}
            />
            <audio
                src={props.audio}
                key={room}
                hidden
                ref={audioRef}
                onPlay={() => preAudioRef.current?.pause()}
                onEnded={() => {
                    setAudioState(true);
                }}
            />
            {props.next && props.nextTitle && (
                <button
                    className="highlight"
                    onClick={handleNext}
                    disabled={!(props.shouldShowNextButtonAlways || audioState)}
                >
                    다음: {props.nextTitle}
                </button>
            )}
            <div className="row">
                <div style={{ color: "#999", fontSize: "14px" }}>손전등을 키려면 전원을 길게 누르세요</div>
                <div style={{ flexGrow: 1 }} />
                <button onClick={handleHelp} className="chip">
                    <HiBellAlert size={20} />
                    도움 요청
                </button>
            </div>
            {scriptPopup && (
                <div style={{ position: "fixed", top: "12px", right: "12px", bottom: "80px", left: "12px" }}>
                    <div
                        style={{
                            backgroundColor: "white",
                            color: "black",
                            height: "100%",
                            borderRadius: "24px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                            padding: "20px",
                        }}
                    >
                        <div style={{ alignSelf: "flex-end" }}>
                            <HiXMark size={24} onClick={() => setScriptPopup(false)} />
                        </div>
                        <p style={{ lineHeight: 1.75 }}>{props.script}</p>
                    </div>
                </div>
            )}
            {((!preAudioState && props.beforeTag && nfcTag !== props.beforeTag) ||
                (audioState && props.afterTag && nfcTag !== props.afterTag)) && (
                <div style={{ position: "fixed", top: "12px", right: "12px", bottom: "80px", left: "12px" }}>
                    <div
                        style={{
                            backgroundColor: "white",
                            color: "black",
                            height: "100%",
                            borderRadius: "24px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "20px",
                        }}
                    >
                        {!preAudioState && props.beforeTag && nfcTag !== props.beforeTag && (
                            <p style={{ whiteSpace: "pre", textAlign: "center" }}>{props.beforeTagDescription}</p>
                        )}
                        {audioState && props.afterTag && nfcTag !== props.afterTag && (
                            <p style={{ whiteSpace: "pre", textAlign: "center" }}>{props.afterTagDescription}</p>
                        )}
                    </div>
                </div>
            )}
        </Page>
    );
}

export default ControlPage;
