let buffer;
const spots = [];
const count = 120;

function setup() {
    const canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    colorMode(HSB);
    ellipseMode(CENTER);
    angleMode(RADIANS);
    frameRate(20);
    buffer = new VideoBuffer(width / 4, height / 4);
    for (let i = 0; i < 6000; i++) {
        spots.push(new Spot(canvas, buffer));
    }
}

function draw() {
    translate(-width / 2, -height / 2);
    buffer.update();
    background("#000033");
    if (frameCount > 10) {
        for (spot of spots) {
            spot.update();
            spot.show();
        }
    }
}

class Spot {
    constructor(canvas, buffer) {
        this.buffer = buffer;
        this.x = random(canvas.width);
        this.y = random(canvas.height);
        this.xBuffer = int((this.x / canvas.width) * buffer.width);
        this.yBuffer = int((this.y / canvas.height) * buffer.height);

        this.hue = random(10, 200);
        this.saturation = random(5, 25);
        this.brightness = 120;
        this.alpha = 5;
        this.maxRadius = random(3, 14);
        this.radius = 5;
    }

    update() {
        const videoColor = this.buffer.getColor(this.xBuffer, this.yBuffer);
        const b = brightness(videoColor);
        this.radius = map(b, 0, 70, this.maxRadius, 0.5);
        this.brightness = map(b, 0, 100, 100, 50);
    }

    show() {
        noStroke();
        fill(this.hue, this.saturation, this.brightness);
        ellipse(this.x, this.y, this.radius, this.radius);
    }
}

class VideoBuffer {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.capture = createCapture(VIDEO);
        this.capture.size(this.width, this.height);
        this.buffer = createGraphics(this.width, this.height);
        this.buffer.pixelDensity(1);
    }

    getBuffer() {
        return this.buffer;
    }

    update() {
        this.copyWebcamToBuffer();
        this.buffer.loadPixels();
    }

    getColor(x, y) {
        x = int(x);
        y = int(y);
        const index = 4 * (x + y * this.width);
        return this.buffer.color(
            this.buffer.pixels[index],
            this.buffer.pixels[index + 1],
            this.buffer.pixels[index + 2],
            this.buffer.pixels[index + 3],
        );
    }

    copyWebcamToBuffer() {
        this.buffer.push();
        this.buffer.translate(this.width, 0);
        this.buffer.scale(-1.0, 1.0);
        this.buffer.image(this.capture, 0, 0);
        this.buffer.pop();
    }
}
