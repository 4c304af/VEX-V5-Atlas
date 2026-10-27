export const ACCENTS = [
  { id: 'jade', color: '#006b57', zh: '翡翠', en: 'Jade' },
  { id: 'iris', color: '#6952a2', zh: '鸢尾', en: 'Iris' },
  { id: 'clay', color: '#9a542e', zh: '陶土', en: 'Clay' },
] as const;

export function normalizeColor(value: string): string | null {
  const hex = value.trim();
  if (/^#[\da-f]{6}$/i.test(hex)) return hex.toLowerCase();
  if (/^#[\da-f]{3}$/i.test(hex)) return '#' + [...hex.slice(1)].map(c => c + c).join('').toLowerCase();
  return null;
}

function rgb(hex: string) {
  return [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
}
function mix(a: string, b: string, amount: number) {
  const end = rgb(b);
  return '#' + rgb(a).map((v, i) => Math.round(v + (end[i] - v) * amount).toString(16).padStart(2, '0')).join('');
}
function luminance(hex: string) {
  return rgb(hex).map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)
    .reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
}
export function contrast(a: string, b: string) {
  const values = [luminance(a), luminance(b)];
  return (Math.max(...values) + .05) / (Math.min(...values) + .05);
}

export function accentPalette(accent: string, customColor: string | undefined, dark: boolean) {
  const seed = (accent === 'custom' ? normalizeColor(customColor ?? '') : ACCENTS.find(a => a.id === accent)?.color) ?? ACCENTS[0].color;
  const surface = dark ? '#141d18' : '#f8f9f4';
  const container = mix(surface, seed, dark ? .18 : .14);
  const soft = mix(surface, seed, dark ? .1 : .07);
  const backgrounds = [surface, container, soft, dark ? '#26352a' : '#ebeee5', dark ? '#1b2720' : '#fffefa'];
  let primary = seed;
  // Keep links, selected labels, and buttons readable even for white/black seeds.
  for (let step = dark ? 50 : 0; step <= 100; step++) {
    primary = mix(seed, dark ? '#ffffff' : '#000000', step / 100);
    if (backgrounds.every(bg => contrast(primary, bg) >= 4.5)) break;
  }
  return {
    '--primary': primary,
    '--on-primary': contrast(primary, '#ffffff') >= contrast(primary, '#000000') ? '#ffffff' : '#000000',
    '--primary-container': container,
    '--primary-soft': soft,
  };
}
