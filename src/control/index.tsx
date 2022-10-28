import Page from "components/Page";
import useControlSocket from "hooks/useControlSocket";
import React, { useEffect, useState } from "react";
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
    };
};

const prop: Prop = {
    solid: {
        image: "/solid.png",
        title: "고체",
        description: "걷잡을 수 없는 사회의 압박 속에 사그라드는 열정. 몸도 마음도 딱딱하게 굳어버린 ‘현대판 노예’.",
        next: "liquid",
        nextTitle: "액체",
    },
    liquid: {
        image: "/liquid.png",
        title: "액체",
        description:
            "사회적 압박과 내면의 열정의 적절한 균형 하에서 일상을 영위하는 평범한 사회인의 인간상을 보여준다.",
        next: "gas",
        nextTitle: "기체",
    },
    gas: {
        image: "/gas.png",
        title: "기체",
        description:
            "사회적 압박으로부터 비교적 자유로워진 내면의 열정을 키움과 더불어 외부로 발산하며 커다란 영향력을 펼친다.",
        next: "super",
        nextTitle: "초임계유체",
    },
    super: {
        image: "/super.png",
        title: "초임계유체",
        description: "",
        next: null,
        nextTitle: null,
    },
};

function ControlPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [prevRoom, setPrevRoom] = useState<string | null>(null);
    const { on, off, help, setUrl, connectionState } = useControlSocket();

    let room = searchParams.get("room");

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
        // if (confirm("다음 방으로 넘어갈까요?")) {
        navigate(`/control?room=${props.next}`);
        // }
    };

    return (
        <Page>
            <img src={props.image} />
            <div>{props.title}</div>
            <div>{props.description}</div>
            {props.next && props.nextTitle && <button onClick={handleNext}>다음 방: {props.nextTitle}</button>}
        </Page>
    );
}

export default ControlPage;
