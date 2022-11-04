import Page from "components/Page/Page";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { animated, config, useTransition } from "react-spring";
import { io } from "socket.io-client";
import fscreen from "fscreen";

interface FullScreenPresentProps {
    src?: string;
    state: boolean;
    videoMode?: "normal" | "loop";
    contentMode: "video" | "p5js";
}

function FullScreenPresent({ src, state, videoMode, contentMode }: FullScreenPresentProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoMode === "normal") {
            if (state) {
                if (videoRef.current && "currentTime" in videoRef.current) videoRef.current.currentTime = 0;
                videoRef.current?.play();
            } else {
                videoRef.current?.pause();
            }
        }
    }, [state, videoMode]);

    const transitions = useTransition(!state, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: !state,
        config: config.molasses,
    });

    if (contentMode === "video" && !src) return null;

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "stretch",
                alignItems: "stretch",
                position: "relative",
            }}
        >
            {contentMode === "p5js" ? (
                <div
                    style={{ margin: "auto", position: "relative", width: "100%", height: "100%", overflow: "hidden" }}
                    dangerouslySetInnerHTML={{
                        __html: `
                                <iframe
                                    style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; border: none;"
                                    srcdoc='<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="https://cdn.jsdelivr.net/npm/p5@1.5.0/lib/p5.min.js"></script>
    <link rel="stylesheet" type="text/css" href="style.css">
    <meta charset="utf-8" />

  </head>
  <body>
    <script src="${process.env.PUBLIC_URL}/sketch.js"></script>
  </body>
</html>'
allow="camera; microphone"
                                />`,
                    }}
                />
            ) : (
                <video ref={videoRef} autoPlay={videoMode === "loop"} loop={videoMode === "loop"}>
                    {src && <source src={src} />}
                </video>
            )}
            {transitions(
                ({ opacity }, item) =>
                    item && (
                        <animated.div
                            style={{
                                backgroundColor: "black",
                                position: "absolute",
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0,
                                opacity,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                            }}
                        >
                            휴대폰에서 &quot;다음 방&quot; 버튼을 눌러주세요.
                        </animated.div>
                    ),
            )}
        </div>
    );
}

function ControlPage() {
    const [connectionState, setConnectionState] = useState(false);
    const [socketId, setSocketId] = useState("");
    const [url, setUrl] = useState("");
    const [room, setRoom] = useState("solid");
    const [state, setState] = useState(false);
    const [contentMode, setContentMode] = useState<"video" | "p5js">("video");
    const [videoSrc, setVideoSrc] = useState<string | undefined>();
    const [videoMode, setVideoMode] = useState<"normal" | "loop">("loop");

    const [fullscreen, setFullscreen] = useState(false);

    const socket = useMemo(() => io(url), [url]);

    const videoRef = useRef<HTMLVideoElement>(null);
    const ref = useRef<HTMLDivElement>(null);

    const handleFullscreenChange = React.useCallback(() => {
        if (fscreen.fullscreenElement !== null) {
            setFullscreen(true);
        } else {
            setFullscreen(false);
        }
    }, []);

    useEffect(() => {
        fscreen.addEventListener("fullscreenchange", handleFullscreenChange, false);
        return () => fscreen.removeEventListener("fullscreenchange", handleFullscreenChange);
    });

    useEffect(() => {
        socket.on("connect", () => {
            setConnectionState(true);
            socket.emit("join", room);
            setSocketId(socket.id);
        });

        socket.on("disconnect", () => {
            setConnectionState(false);
        });

        socket.on("message", (message) => {
            if (message === "on") {
                setState(true);
                videoRef.current?.play();
            } else {
                setState(false);
                videoRef.current?.pause();
            }
        });
    }, [socket]);

    useEffect(() => {
        if (connectionState) {
            setState(false);
            socket.emit("leave");
            socket.emit("join", room);
        }
    }, [room]);

    const [urlInput, setUrlInput] = useState("localhost:4000");

    return (
        <div ref={ref}>
            {fullscreen ? (
                <FullScreenPresent state={state} src={videoSrc} videoMode={videoMode} contentMode={contentMode} />
            ) : (
                <Page>
                    <div>
                        <h3>서버 주소</h3>
                        <input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="주소" />
                    </div>
                    <div>
                        <h3>프로젝터 이름</h3>
                        <select onChange={(e) => setRoom(e.target.value)}>
                            <option value="solid">고체</option>
                            <option value="liquid">액체</option>
                            <option value="gas">기체</option>
                            <option value="super">초임계유체</option>
                        </select>
                    </div>

                    <div>
                        <h3>서버 연결 상태</h3>
                        {String(connectionState)}
                    </div>
                    <div>
                        <h3>연결 ID</h3>
                        {socketId}
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
                    <div>
                        <h3>콘텐츠</h3>
                        <select onChange={(e) => setContentMode(e.target.value as "video" | "p5js")}>
                            <option value="video">영상</option>
                            <option value="p5js">P5.js</option>
                        </select>
                    </div>
                    {contentMode === "video" && (
                        <>
                            <div>
                                <h3>영상 선택</h3>
                                <input
                                    type="file"
                                    id="fileUpload"
                                    onChange={(e) =>
                                        e.target.files?.[0] && setVideoSrc(URL.createObjectURL(e.target.files?.[0]))
                                    }
                                />
                            </div>
                            <div>
                                <h3>영상 선택</h3>
                                <select onChange={(e) => setVideoSrc(e.target.value)}>
                                    <option value="/solid.mp4">고체</option>
                                    <option value="/liquid.mp4">액체</option>
                                    <option value="/super.mp4">초임계유체</option>
                                </select>
                            </div>
                            {videoSrc && (
                                <video width="400" controls ref={videoRef}>
                                    <source src={videoSrc} />
                                </video>
                            )}
                            <div>
                                <h3>영상 모드</h3>
                                <select onChange={(e) => setVideoMode(e.target.value as "normal" | "loop")}>
                                    <option value="loop">루프</option>
                                    <option value="normal">기본</option>
                                </select>
                            </div>
                        </>
                    )}
                    <div>
                        <button
                            onClick={() => {
                                if (ref.current) {
                                    if (videoSrc || contentMode === "p5js") fscreen.requestFullscreen(ref.current);
                                    else alert("영상을 선택해주세요.");
                                }
                            }}
                        >
                            전체 화면
                        </button>
                    </div>
                </Page>
            )}
        </div>
    );
}

export default ControlPage;
