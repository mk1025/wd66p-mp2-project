export function LinearScale(min, max, start, end, x) {
    return start + (end - start) * ((x - min) / (max - min));
}
