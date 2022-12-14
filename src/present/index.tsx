import Page from "components/Page/Page";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Camera from "react-html5-camera-photo";
import { animated, config, useTransition } from "react-spring";
import Webcam from "react-webcam";
import { io } from "socket.io-client";
import fscreen from "fscreen";
import styled from "styled-components";

const FullScreenContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: stretch;
    align-items: stretch;
    position: relative;

    #container-circles {
        display: none;
    }
`;

interface FullScreenPresentProps {
    src?: string;
    state: boolean;
    videoMode?: "normal" | "loop";
    contentMode: "video" | "p5js" | "camera";
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
        <FullScreenContainer>
            {contentMode === "p5js" && (
                <div
                    style={{ margin: "auto", position: "relative", width: "100%", height: "100%", overflow: "hidden" }}
                    dangerouslySetInnerHTML={{
                        __html: `
                                <iframe
                                    style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; border: none;"
                                    srcdoc='<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="https://cdn.jsdelivr.net/npm/p5@1.5.0/lib/p5.min.js"/>
    <script src="https://unpkg.com/handsfree@8.5.1/build/lib/handsfree.js"/>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/handsfree@8.1.1/build/lib/assets/handsfree.css"/>
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
            )}
            {contentMode === "video" && (
                <video ref={videoRef} autoPlay={videoMode === "loop"} loop={videoMode === "loop"}>
                    {src && <source src={src} />}
                </video>
            )}
            {contentMode === "camera" && <Webcam style={{ minWidth: "100%" }} />}
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
                            ??????????????? &quot;?????? ???&quot; ????????? ???????????????.
                        </animated.div>
                    ),
            )}
        </FullScreenContainer>
    );
}

function ControlPage() {
    const [connectionState, setConnectionState] = useState(false);
    const [url, setUrl] = useState("");
    const [room, setRoom] = useState("solid");
    const [state, setState] = useState(false);
    const [contentMode, setContentMode] = useState<"video" | "p5js" | "camera">("video");
    const [videoSrc, setVideoSrc] = useState<string | undefined>("/solid.mp4");
    const [videoMode, setVideoMode] = useState<"normal" | "loop">("normal");

    const [fullscreen, setFullscreen] = useState(false);

    const socket = useMemo(
        () =>
            io(url, {
                rejectUnauthorized: true,
            }),
        [url],
    );

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
        });

        socket.on("disconnect", () => {
            setConnectionState(false);
        });

        socket.on("on", (message) => {
            if (message === room) {
                setState(true);
                if (room === "liquid") setContentMode("video");
                videoRef.current?.play();
            } else if (room === "liquid") {
                if (message === "gas") {
                    setContentMode("camera");
                    setState(true);
                }
            }
        });

        socket.on("off", (message) => {
            if (message === room) {
                setState(false);
                videoRef.current?.pause();
            } else if (room === "liquid") {
                if (message === "gas") {
                    setContentMode("video");
                    setState(false);
                }
            }
        });
    }, [socket]);

    const [urlInput, setUrlInput] = useState("localhost:4000");
    const [isPreset, setIsPreset] = useState(true);

    const handleSolidPreset = () => {
        setRoom("solid");
        setContentMode("video");
        setVideoSrc("/solid.mp4");
        setVideoMode("normal");
    };

    const handleLiquidPreset = () => {
        setRoom("liquid");
        setContentMode("video");
        setVideoSrc("/liquid.mp4");
        setVideoMode("normal");
    };

    const handleGasPreset = () => {
        setRoom("gas");
        setContentMode("p5js");
    };

    const handleSuperPreset = () => {
        setRoom("super");
        setContentMode("video");
        setVideoSrc("/super.mp4");
        setVideoMode("normal");
    };

    return (
        <div ref={ref}>
            {fullscreen ? (
                <FullScreenPresent state={state} src={videoSrc} videoMode={videoMode} contentMode={contentMode} />
            ) : (
                <Page>
                    <div>
                        <h3>?????? ??????</h3>
                        <input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="??????" />
                    </div>
                    <div>
                        <h3>???????????? ??????</h3>
                        <select value={room} onChange={(e) => setRoom(e.target.value)}>
                            <option value="solid">??????</option>
                            <option value="liquid">??????</option>
                            <option value="gas">??????</option>
                            <option value="super">???????????????</option>
                        </select>
                    </div>

                    <div>
                        <h3>?????? ?????? ??????</h3>
                        {String(connectionState)}
                    </div>
                    {/*
                    <div>
                        <h3>?????? ID</h3>
                        {socketId}
                    </div>
                    */}
                    <div>
                        <button
                            className="highlight"
                            onClick={() => {
                                if (connectionState) setUrl("");
                                else setUrl(urlInput);
                            }}
                        >
                            {connectionState ? "?????? ??????" : "??????"}
                        </button>
                    </div>

                    <div>
                        <h3>?????????</h3>
                        <select
                            onChange={(e) => {
                                setIsPreset(e.target.value !== "custom");
                                switch (e.target.value) {
                                    case "solid":
                                        handleSolidPreset();
                                        break;
                                    case "liquid":
                                        handleLiquidPreset();
                                        break;
                                    case "gas":
                                        handleGasPreset();
                                        break;
                                    case "super":
                                        handleSuperPreset();
                                        break;
                                    default:
                                        break;
                                }
                            }}
                        >
                            <option value="solid">??????</option>
                            <option value="liquid">??????</option>
                            <option value="gas">??????</option>
                            <option value="super">???????????????</option>
                            <option value="custom">????????? ??????</option>
                        </select>
                    </div>
                    {!isPreset && (
                        <>
                            <div>
                                <h3>?????????</h3>
                                <select
                                    value={contentMode}
                                    onChange={(e) => setContentMode(e.target.value as "video" | "p5js")}
                                >
                                    <option value="video">??????</option>
                                    <option value="p5js">P5.js</option>
                                </select>
                            </div>
                            {contentMode === "video" && (
                                <>
                                    <div>
                                        <h3>?????? ??????</h3>
                                        <input
                                            type="file"
                                            id="fileUpload"
                                            onChange={(e) =>
                                                e.target.files?.[0] &&
                                                setVideoSrc(URL.createObjectURL(e.target.files?.[0]))
                                            }
                                        />
                                    </div>
                                    <div>
                                        <h3>?????? ??????</h3>
                                        <select value={videoSrc} onChange={(e) => setVideoSrc(e.target.value)}>
                                            <option value="/solid.mp4">??????</option>
                                            <option value="/liquid.mp4">??????</option>
                                            <option value="/super.mp4">???????????????</option>
                                        </select>
                                    </div>
                                    {videoSrc && (
                                        <video width="400" controls ref={videoRef} key={videoSrc}>
                                            <source src={videoSrc} />
                                        </video>
                                    )}
                                    <div>
                                        <h3>?????? ??????</h3>
                                        <select
                                            value={videoMode}
                                            onChange={(e) => setVideoMode(e.target.value as "normal" | "loop")}
                                        >
                                            <option value="normal">??????</option>
                                            <option value="loop">??????</option>
                                        </select>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                    <div>
                        <button
                            className="highlight"
                            onClick={() => {
                                if (ref.current) {
                                    if (videoSrc || contentMode === "p5js") fscreen.requestFullscreen(ref.current);
                                    else alert("????????? ??????????????????.");
                                }
                            }}
                        >
                            ?????? ??????
                        </button>
                    </div>
                </Page>
            )}
        </div>
    );
}

export default ControlPage;
