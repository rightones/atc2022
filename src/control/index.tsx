import Page from "components/Page";
import useControlSocket from "hooks/useControlSocket";
import React, { useEffect, useRef, useState } from "react";
import {
    HiBackward,
    HiBellAlert,
    HiChevronLeft,
    HiChevronRight,
    HiDocumentText,
    HiPlay,
    HiStop,
} from "react-icons/hi2";
import { useNavigate } from "react-router";
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
        audio: string;
    };
};

const prop: Prop = {
    solid: {
        image: "/solid.png",
        title: "고체",
        description: "걷잡을 수 없는 사회의 압박 속에 사그라드는 열정. 몸도 마음도 딱딱하게 굳어버린 ‘현대판 노예’.",
        next: "liquid",
        nextTitle: "액체",
        audio: "/solid.m4a",
    },
    liquid: {
        image: "/liquid.png",
        title: "액체",
        description:
            "사회적 압박과 내면의 열정의 적절한 균형 하에서 일상을 영위하는 평범한 사회인의 인간상을 보여준다.",
        next: "gas",
        nextTitle: "기체",
        audio: "/liquid.m4a",
    },
    gas: {
        image: "/gas.png",
        title: "기체",
        description:
            "사회적 압박으로부터 비교적 자유로워진 내면의 열정을 키움과 더불어 외부로 발산하며 커다란 영향력을 펼친다.",
        next: "super",
        nextTitle: "초임계유체",
        audio: "/bgm.mp3",
    },
    super: {
        image: "/super.png",
        title: "초임계유체",
        description: "",
        next: null,
        nextTitle: null,
        audio: "/super.m4a",
    },
};

function ControlPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [prevRoom, setPrevRoom] = useState<string | null>(null);
    const { on, off, help, setUrl, connectionState } = useControlSocket();
    const audioRef = useRef<HTMLAudioElement>(null);

    let room = searchParams.get("room");

    useEffect(() => {
        (async () => {
            if (typeof NDEFReader !== "undefined") {
                try {
                    const ndef = new NDEFReader();
                    await ndef.scan();
                    console.log("> Scan started");
                    ndef.addEventListener("reading", ({ message, serialNumber }: any): void => {
                        alert(`> Serial Number: ${serialNumber}`);
                    });
                } catch (error) {
                    alert(`Argh! ${error}`);
                }
            }
        })();
    }, []);

    useEffect(() => {
        if (connectionState) {
            if (prevRoom) off(prevRoom);
            setPrevRoom(room || "solid");
            on(room || "solid");
        }
    }, [searchParams, connectionState]);

    const [urlInput, setUrlInput] = useState("localhost:4000");

    useEffect(() => {
        if (searchParams.get("url")) {
            setUrlInput(searchParams.get("url") as string);
        }
    }, [searchParams]);

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
                            else setUrl(urlInput);
                        }}
                    >
                        {connectionState ? "연결 해제" : "연결"}
                    </button>
                </div>
            </Page>
        );
    }

    if (!room || !["solid", "liquid", "gas", "super"].includes(room)) {
        room = "solid";
    }
    const props = prop[room as Room];

    const handleNext = () => {
        if (confirm("다음 방으로 넘어갈까요?")) {
            navigate(`/control?room=${props.next}`);
        }
    };

    const handleHelp = () => {
        // if (confirm("다음 방으로 넘어갈까요?")) {
        help();
        // }
    };

    const handlePlay = () => {
        audioRef.current?.play();
    };

    const handleStop = () => {
        audioRef.current?.pause();
    };

    return (
        <Page>
            <div className="row">
                <button onClick={() => navigate(-1)} className="circle">
                    <HiChevronLeft size={28} />
                </button>
                <div style={{ flexGrow: 1 }} />
                <button onClick={handleHelp} className="chip">
                    <HiBellAlert size={20} />
                    도움 요청
                </button>
            </div>
            <img src={props.image} />
            <h1>{props.title}</h1>
            <div>{props.description}</div>
            <div className="row">
                <div className="box row">
                    <button onClick={handlePlay} className="circle">
                        <HiPlay size={28} />
                    </button>
                    <button onClick={handleStop} className="circle">
                        <HiStop size={28} />
                    </button>
                    <button onClick={handleStop} className="circle">
                        <HiBackward size={28} />
                    </button>
                </div>
                <button onClick={handleNext} style={{ alignSelf: "stretch", height: "auto" }}>
                    스크립트
                    <HiChevronRight />
                </button>
            </div>
            <audio controls src={props.audio} autoPlay key={room} hidden ref={audioRef} />
            {props.next && props.nextTitle && (
                <button className="highlight" onClick={handleNext}>
                    다음 방: {props.nextTitle}
                </button>
            )}
        </Page>
    );
}

export default ControlPage;
