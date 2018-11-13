export default function Bresenhame(x1, y1, x2, y2) { // fixme сделать асинхронным
    const deltaX = Math.abs(x2 - x1),
        deltaY = Math.abs(y2 - y1),
        signX = x1 < x2 ? 1 : -1,
        signY = y1 < y2 ? 1 : -1,
        points = [];

    let error = deltaX - deltaY;

    while (x1 !== x2 || y1 !== y2) {
        points.push({x: x1, y: y1});
        const error2 = error * 2;
        if (error2 > -deltaY) {
            error -= deltaY;
            x1 += signX;
        }
        if (error2 < deltaX) {
            error += deltaX;
            y1 += signY;
        }
    }
    points.push({x: x2, y: y2});

    return points;
}
