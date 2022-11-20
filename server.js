const cors = require("cors");
const app = require("express")();
const ip = require("ip");

const readline = require("readline");

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const Reset = "\x1b[0m";
const Bright = "\x1b[1m";
const Dim = "\x1b[2m";
const Underscore = "\x1b[4m";
const Blink = "\x1b[5m";
const Reverse = "\x1b[7m";
const Hidden = "\x1b[8m";

const FgBlack = "\x1b[30m";
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const FgYellow = "\x1b[33m";
const FgBlue = "\x1b[34m";
const FgMagenta = "\x1b[35m";
const FgCyan = "\x1b[36m";
const FgWhite = "\x1b[37m";

const BgBlack = "\x1b[40m";
const BgRed = "\x1b[41m";
const BgGreen = "\x1b[42m";
const BgYellow = "\x1b[43m";
const BgBlue = "\x1b[44m";
const BgMagenta = "\x1b[45m";
const BgCyan = "\x1b[46m";
const BgWhite = "\x1b[47m";

const room = ["solid", "liquid", "gas", "super"];

app.use(cors());

const fs = require("fs");

const options = {
    key: fs.readFileSync("./.cert/key.pem"),
    cert: fs.readFileSync("./.cert/cert.pem"),
    requestCert: false,
    rejectUnauthorized: false,
};

const httpServer = require("https").createServer(options, app);
const { Server } = require("socket.io");
const qrcode = require("qrcode-terminal");

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    /*
    socket.on("join", (data) => {
        if (!room.includes(data)) {
            console.log(
                `${FgRed} error ${Reset}${BgGreen}${FgBlack}[프로젝터]${Reset} ${data}(은)는 올바른 프로젝터 이름이 아닙니다. ${socket.id}`,
            );
        } else {
            socket.join(data);
            console.log(
                `${FgYellow} alert ${Reset}${BgGreen}${FgBlack}[프로젝터]${Reset} ${data}에 프로젝터가 연결되었습니다. ${socket.id}`,
            );
        }
    });

    socket.on("leave", () => {
        const rooms = Array.from(socket.rooms).filter((element) => room.includes(element));
        rooms.forEach((element) => socket.leave(element));
        console.log(
            `${FgYellow} alert ${Reset}${BgGreen}${FgBlack}[프로젝터]${Reset} ${rooms.map(
                (room) => `${room} `,
            )}에서 프로젝터가 연결 해제되었습니다. ${socket.id}`,
        );
    });

    socket.on("message", (data) => {
        io.emit(data);
    });
     */

    socket.on("on", (data) => {
        io.sockets.emit("on", data);
        console.log(`${FgGreen} ON    ${Reset}${BgCyan}${FgBlack}[앱]${Reset} ${data}에 연결된 프로젝터를 켰습니다.`);
    });

    socket.on("off", (data) => {
        io.sockets.emit("off", data);
        console.log(`${FgBlue} OFF   ${Reset}${BgCyan}${FgBlack}[앱]${Reset} ${data}에 연결된 프로젝터를 껐습니다.`);
    });

    socket.on("help", () => {
        console.log(`${FgRed} HELP  ${Reset}${BgCyan}${FgBlack}[앱]${Reset} 앱에서 도움 요청이 왔습니다.`);
    });

    /*
    socket.on("disconnecting", async () => {
        const rooms = Array.from(socket.rooms).filter((element) => room.includes(element));
        if (rooms.length > 0)
            console.log(
                `${FgMagenta} warn  ${Reset}${BgGreen}${FgBlack}[프로젝터]${Reset} ${rooms.map(
                    (room) => `${room} `,
                )}에 연결된 프로젝터의 연결이 끊겼습니다. ${socket.id}`,
            );
    });
     */
});

httpServer.listen(4000);

qrcode.generate(`https://atc2022-ignis.vercel.app/control?room=solid&url=${ip.address()}:4000`, { small: true });

require("console-stamp")(console, { format: ":date(HH:MM:ss.l)" });

console.log(
    `${BgBlack + Dim} info  ${Reset}${BgBlue}${FgBlack}[서버]${Reset} ${ip.address()}:4000에서 서버가 실행 중입니다.`,
);

process.stdin.on("keypress", (str, key) => {
    /*
    if (str === "l") {
        console.log("");
        console.log(`${BgYellow + FgBlack} 연결된 프로젝터 상태 ${Reset}`);
        room.map((item) => {
            const ids = Array.from(io.sockets.adapter.rooms.get(item) ?? []);
            console.log(
                `${Bright + item.padStart(10, " ") + Reset} ${ids.length}  ${
                    ids.length > 0 ? ids?.map((id) => `${id}, `) : "연결 없음"
                }`,
            );
        });
        console.log("");
    }

     */
    if (str === "q") {
        qrcode.generate(
            `https://atc2022-ignis.vercel.app/control?room=solid&url=${ip.address()}:4000`,
            { small: true },
            (qrcode) => {
                console.log(`\n${qrcode}`);
            },
        );
    }
    if ((key && key.ctrl && key.name === "c") || str === "e") process.exit();
});
