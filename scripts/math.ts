export function LinearScale(
  min: number,
  max: number,
  start: number,
  end: number,
  x: number,
) {
  return start + (end - start) * ((x - min) / (max - min));
}
