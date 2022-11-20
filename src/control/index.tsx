import { Update } from "@remix-run/router/history";
import Page from "components/Page";
import useControlSocket from "hooks/useControlSocket";
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
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
        // script: string;
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
    },
};

function ControlPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [prevRoom, setPrevRoom] = useState<string | null>(null);
    const { on, off, help, setUrl, connectionState } = useControlSocket();
    const [preAudioState, setPreAudioState] = useState(false);
    const [audioState, setAudioState] = useState(false);
    const preAudioRef = useRef<HTMLAudioElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

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

    if (!connectionState) {
        return (
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
        );
    }

    return (
        <Page>
            <img src={props.image} />
            <h1>{props.title}</h1>
            <div>{props.description}</div>
            <div style={{ flexGrow: 1 }} />
            <button onClick={handleNext}>
                나레이션 스크립트
                <HiChevronRight />
            </button>
            <audio
                src={props.preAudio}
                key={room}
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
                <div style={{ color: "#999", fontSize: "14px" }}>손전등을 키려면 뒷면을 두 번 두드리세요</div>
                <div style={{ flexGrow: 1 }} />
                <button onClick={handleHelp} className="chip">
                    <HiBellAlert size={20} />
                    도움 요청
                </button>
            </div>
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
                            <div>{props.beforeTagDescription}</div>
                        )}
                        {audioState && props.afterTag && nfcTag !== props.afterTag && (
                            <div>{props.afterTagDescription}</div>
                        )}
                    </div>
                </div>
            )}
        </Page>
    );
}

export default ControlPage;
