// 静止画の図で使う計算と描画の小道具（ビルド時に走る）。数値は gen-data.py が作った data.json から読む
import data from './data.json';

export { data };
export const N = 16;
export const R = 0.4;
export const COLORS = { text: '#15233d', muted: '#5c6b7c', faint: '#8c99a6', rule: '#d9e0e6', grid: '#ebeff2', dmd: '#2350d8', solver: '#c4581c', exact: '#16866a' };

// 陽解法の行列 A（r = Δt/Δx² = 0.4）
export const A: number[][] = Array.from({ length: N }, (_, i) =>
	Array.from({ length: N }, (_, j) => (i === j ? 1 - 2 * R : Math.abs(i - j) === 1 ? R : 0)),
);
export const matVec = (M: number[][], v: number[]) => M.map((row) => row.reduce((s, a, j) => s + a * v[j], 0));

export type Cell = { x: number; y: number; w: number; h: number; fill: string };

// 値 v（−m〜m）の色。正は青、負は橙。0 に近い値は白
export const diverging = (v: number, m: number) => {
	const t = Math.max(-1, Math.min(1, v / m));
	const a = Math.abs(t);
	if (a < 0.004) return '#ffffff';
	return t > 0 ? `rgba(35,80,216,${(0.08 + 0.92 * a).toFixed(3)})` : `rgba(196,88,28,${(0.08 + 0.92 * a).toFixed(3)})`;
};
// 0〜m の値を青の濃さで塗る
export const sequential = (v: number, m: number) => {
	const a = Math.max(0, Math.min(1, v / m));
	return a < 0.004 ? '#ffffff' : `rgba(35,80,216,${(0.06 + 0.94 * a).toFixed(3)})`;
};

export function cells(M: number[][], x0: number, y0: number, cw: number, ch: number, color: (v: number) => string): Cell[] {
	const out: Cell[] = [];
	M.forEach((row, i) => row.forEach((v, j) => out.push({ x: x0 + j * cw, y: y0 + i * ch, w: cw, h: ch, fill: color(v) })));
	return out;
}

export const pts = (xs: number[], ys: number[], sx: (v: number) => number, sy: (v: number) => number) =>
	xs.map((x, i) => `${sx(x).toFixed(1)},${sy(ys[i]).toFixed(1)}`).join(' ');

export const sup = (n: number) => String(n).replace(/-/g, '⁻').replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]);
// 3.9×10⁻¹⁴ の形
export const sci = (v: number, digits = 1) => {
	if (v === 0) return '0';
	const [m, e] = v.toExponential(digits).split('e');
	return `${m}×10${sup(parseInt(e, 10))}`;
};
