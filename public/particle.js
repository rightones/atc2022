function linePoint(x1, y1, x2, y2, px, py) {
    const d1 = dist(px, py, x1, y1);
    const d2 = dist(px, py, x2, y2);

    const lineLen = dist(x1, y1, x2, y2);

    const buffer = 10;

    if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
        return true;
    }
    return false;
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw() {
        fill(this.color);
        circle(this.x, this.y, 40);
    }

    update() {}

    collide(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (linePoint(arr[i][0], arr[i][1], arr[i][2], arr[i][3], this.x, this.y)) {
                if (this.x < width / 2) {
                    this.x = Math.min(this.x, map(this.y, arr[i][1], arr[i][3], arr[i][0], arr[i][2]) - 0.5);
                } else {
                    this.x = Math.max(this.y, map(this.y, arr[i][1], arr[i][3], arr[i][0], arr[i][2]) + 0.5);
                }
            }
        }
    }
}
