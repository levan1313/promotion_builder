export function generateRandomId(): string {
  return `id-${Math.random().toString(36).substr(2, 9)}`;
}

export function rgbToHex(rgb: string): string {
  const match = rgb.match(/\d+/g);
  if (!match) return "#ffffff";
  const [r, g, b] = match.map(Number);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
