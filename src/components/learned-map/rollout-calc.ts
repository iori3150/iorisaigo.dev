// 図 2 の実計算。振り子 q'' = -sin q の 1 ステップの写像を、ノイズを含む少数のデータから
// 3 次の多項式で最小二乗近似し、正解と並べてロールアウトする。乱数は種を固定する
export const DT = 0.1;
export const STEPS = 400;
export const N_TRAIN = 60;
export const NOISE = 3e-3;
export const Q0 = 1.0;

type S = [number, number];

function mulberry32(seed: number) {
	let a = seed;
	return () => {
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const f = ([q, w]: S): S => [w, -Math.sin(q)];

// 正解：4 次のルンゲ＝クッタ法で Δt を 10 分割する
export function solverStep(s: S): S {
	const n = 10;
	const h = DT / n;
	let [q, w] = s;
	for (let i = 0; i < n; i++) {
		const k1 = f([q, w]);
		const k2 = f([q + (h / 2) * k1[0], w + (h / 2) * k1[1]]);
		const k3 = f([q + (h / 2) * k2[0], w + (h / 2) * k2[1]]);
		const k4 = f([q + h * k3[0], w + h * k3[1]]);
		q += (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
		w += (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
	}
	return [q, w];
}

const features = ([q, w]: S) => [1, q, w, q * q, q * w, w * w, q * q * q, q * q * w, q * w * w, w * w * w];

// 正規方程式をガウスの消去法で解く
function leastSquares(X: number[][], y: number[]) {
	const p = X[0].length;
	const A = Array.from({ length: p }, () => new Array(p + 1).fill(0));
	for (let r = 0; r < X.length; r++) {
		for (let i = 0; i < p; i++) {
			for (let j = 0; j < p; j++) A[i][j] += X[r][i] * X[r][j];
			A[i][p] += X[r][i] * y[r];
		}
	}
	for (let i = 0; i < p; i++) {
		let m = i;
		for (let k = i + 1; k < p; k++) if (Math.abs(A[k][i]) > Math.abs(A[m][i])) m = k;
		[A[i], A[m]] = [A[m], A[i]];
		for (let k = 0; k < p; k++) {
			if (k === i) continue;
			const c = A[k][i] / A[i][i];
			for (let j = i; j <= p; j++) A[k][j] -= c * A[i][j];
		}
	}
	return A.map((row, i) => row[p] / row[i]);
}

export function computeRollout() {
	const rnd = mulberry32(7);
	const gauss = () => Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd());
	const X: number[][] = [];
	const dq: number[] = [];
	const dw: number[] = [];
	for (let i = 0; i < N_TRAIN; i++) {
		const s: S = [(rnd() * 2 - 1) * 1.5, (rnd() * 2 - 1) * 1.5];
		const next = solverStep(s);
		X.push(features(s));
		dq.push(next[0] - s[0] + NOISE * gauss());
		dw.push(next[1] - s[1] + NOISE * gauss());
	}
	const cq = leastSquares(X, dq);
	const cw = leastSquares(X, dw);
	const model = (s: S): S => {
		const x = features(s);
		return [s[0] + x.reduce((a, v, i) => a + cq[i] * v, 0), s[1] + x.reduce((a, v, i) => a + cw[i] * v, 0)];
	};

	const truth: S[] = [[Q0, 0]];
	const learned: S[] = [[Q0, 0]];
	const error: number[] = [0];
	for (let k = 1; k <= STEPS; k++) {
		truth.push(solverStep(truth[k - 1]));
		learned.push(model(learned[k - 1]));
		error.push(Math.hypot(learned[k][0] - truth[k][0], learned[k][1] - truth[k][1]));
	}
	return { truth, learned, error };
}
