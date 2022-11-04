import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const useControlSocket = () => {
    const [connectionState, setConnectionState] = useState(false);
    const [url, setUrl] = useState("");

    const socket = useMemo(
        () =>
            io(url, {
                rejectUnauthorized: true,
            }),
        [url],
    );

    useEffect(() => {
        socket.on("connect", () => {
            setConnectionState(true);
        });

        socket.on("disconnect", () => {
            setConnectionState(false);
        });
    }, [socket]);

    const on = (room: string) => {
        socket.emit("on", room);
    };

    const off = (room: string) => {
        socket.emit("off", room);
    };

    const help = () => {
        socket.emit("help");
    };

    return { connectionState, setUrl, on, off, help };
};

export default useControlSocket;
