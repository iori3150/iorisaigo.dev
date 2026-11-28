// 図を SVG で描く小道具（ブラウザーで使う）
const NS = 'http://www.w3.org/2000/svg';
export const COLORS = {
	text: '#15233d',
	muted: '#5c6b7c',
	faint: '#8c99a6',
	rule: '#d9e0e6',
	grid: '#ebeff2',
	learned: '#2350d8', // 学習した写像
	solver: '#c4581c', // 陽解法
	other: '#16866a', // 解演算子・PINN
};

export function el(name: string, attrs: Record<string, string | number>, parent?: Element): SVGElement {
	const e = document.createElementNS(NS, name) as SVGElement;
	for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
	parent?.appendChild(e);
	return e;
}
export function text(parent: Element, x: number, y: number, s: string, o: { anchor?: string; size?: number; fill?: string; weight?: number } = {}) {
	const e = el('text', { x, y, 'font-size': o.size ?? 11, fill: o.fill ?? COLORS.muted, 'text-anchor': o.anchor ?? 'start', 'font-weight': o.weight ?? 400 }, parent);
	e.textContent = s;
	return e;
}
export const clear = (g: Element) => {
	while (g.firstChild) g.removeChild(g.firstChild);
};

const sup = (n: number) => String(n).replace(/-/g, '⁻').replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]);
export const pow10 = (p: number) => (p === 0 ? '1' : `10${sup(p)}`);
// 数値の表示：0.01 以上は小数 3 桁、それより小さいと a×10⁻ⁿ、大きすぎると >10ⁿ
export function fmt(v: number): string {
	if (!Number.isFinite(v) || v > 1e6) return '>10⁶';
	if (v === 0) return '0';
	if (v >= 100) return v.toExponential(1).replace(/e\+?(\d+)/, (_, e) => `×10${sup(+e)}`);
	if (v >= 0.01) return v.toFixed(3);
	return v.toExponential(1).replace(/e([+-]\d+)/, (_, e) => `×10${sup(+e)}`);
}

export type Box = { x0: number; x1: number; y0: number; y1: number };

// 温度の分布の枠（x は 0〜1、u は lo〜hi）
export function profileFrame(g: Element, b: Box, lo = 0, hi = 1, ticks = [0, 0.5, 1]) {
	const sx = (x: number) => b.x0 + (b.x1 - b.x0) * x;
	const sy = (u: number) => b.y1 - ((u - lo) / (hi - lo)) * (b.y1 - b.y0);
	for (const u of ticks) {
		el('line', { x1: b.x0, x2: b.x1, y1: sy(u), y2: sy(u), stroke: u === 0 ? COLORS.rule : COLORS.grid }, g);
		text(g, b.x0 - 5, sy(u) + 4, String(u), { anchor: 'end', size: 10 });
	}
	text(g, b.x0, b.y1 + 14, '0', { anchor: 'middle', size: 10 });
	text(g, b.x1, b.y1 + 14, '1', { anchor: 'middle', size: 10 });
	text(g, (b.x0 + b.x1) / 2, b.y1 + 14, 'x', { anchor: 'middle', size: 10 });
	return { sx, sy };
}

export const polyline = (pts: [number, number][]) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

// 対数軸の誤差の枠（10^lo〜10^hi）
export function logFrame(g: Element, b: Box, lo: number, hi: number, xmax: number, xticks: number[], xlabel: string, ylabel: string) {
	const sx = (k: number) => b.x0 + ((b.x1 - b.x0) * k) / xmax;
	const sy = (e: number) => {
		const l = Math.log10(Math.max(e, 10 ** lo));
		return b.y1 - ((Math.min(l, hi) - lo) / (hi - lo)) * (b.y1 - b.y0);
	};
	for (let p = lo; p <= hi; p++) {
		el('line', { x1: b.x0, x2: b.x1, y1: sy(10 ** p), y2: sy(10 ** p), stroke: COLORS.grid }, g);
		text(g, b.x0 - 5, sy(10 ** p) + 4, pow10(p), { anchor: 'end', size: 10 });
	}
	for (const k of xticks) text(g, sx(k), b.y1 + 14, String(k), { anchor: 'middle', size: 10 });
	text(g, b.x1, b.y1 + 28, xlabel, { anchor: 'end', size: 11 });
	text(g, b.x0 - 30, b.y0 - 10, ylabel, { size: 11 });
	return { sx, sy };
}

// 行列の濃淡図。値は −m〜m を、負は橙、正は青の濃さで塗る
export function heatmap(g: Element, M: number[][], x0: number, y0: number, cell: number, m: number) {
	const n = M.length;
	for (let i = 0; i < n; i++)
		for (let j = 0; j < n; j++) {
			const v = Math.max(-1, Math.min(1, M[i][j] / m));
			const a = Math.abs(v);
			const fill = a < 0.004 ? '#ffffff' : v > 0 ? `rgba(35,80,216,${(0.08 + 0.92 * a).toFixed(3)})` : `rgba(196,88,28,${(0.08 + 0.92 * a).toFixed(3)})`;
			el('rect', { x: x0 + j * cell, y: y0 + i * cell, width: cell, height: cell, fill }, g);
		}
	el('rect', { x: x0, y: y0, width: n * cell, height: n * cell, fill: 'none', stroke: COLORS.rule }, g);
}
