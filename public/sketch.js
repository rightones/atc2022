let handsfree;
const particles = [];
let lines = [];

function setup() {
    createCanvas(1280, 800);
    handsfree = new Handsfree({
        showDebug: false,
        hands: true,
        maxNumHands: 2,
    });
    handsfree.start();
    for (let x = 0; x < width - 0; x += 20) {
        for (let y = 0; y < height - 0; y += 20) {
            particles.push(new Particle(x, y, color(0)));
        }
    }
}

const px = (x) => map(x, 0, 1, width, 0);
const py = (y) => map(y, 0, 1, 0, height);

function update() {
    lines = [].concat(
        ...(handsfree.data.hands?.multiHandLandmarks?.map((hand) => {
            return [
                [px(hand[0].x), py(hand[0].y), px(hand[4].x), py(hand[4].y)],
                [px(hand[0].x), py(hand[0].y), px(hand[8].x), py(hand[8].y)],
                [px(hand[0].x), py(hand[0].y), px(hand[12].x), py(hand[12].y)],
                [px(hand[0].x), py(hand[0].y), px(hand[16].x), py(hand[16].y)],
                [px(hand[0].x), py(hand[0].y), px(hand[20].x), py(hand[20].y)],
            ];
        }) ?? []),
    );

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].collide(lines);
    }
}

function drawHand() {
    fill(0);
    noStroke();

    if (handsfree.data.hands) {
        if (handsfree.data.hands.multiHandLandmarks) {
            const landmarks = handsfree.data.hands.multiHandLandmarks;
            const nHands = landmarks.length;

            for (let h = 0; h < nHands; h++) {
                fill(h * 255, 255, 255);
                for (let i = 0; i <= 20; i++) {
                    let px = landmarks[h][i].x;
                    let py = landmarks[h][i].y;

                    px = map(px, 0, 1, width, 0);
                    py = map(py, 0, 1, 0, height);
                    circle(px, py, 10);
                }
            }
        }
    }
}

function draw() {
    update();
    background(255);
    particles?.forEach((particle) => particle.draw());

    lines?.forEach((item) => {
        stroke(0);
        strokeWeight(2);
        line(item[0], item[1], item[2], item[3]);
    });
    // drawHand();
}
