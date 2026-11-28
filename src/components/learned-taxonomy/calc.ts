// IV-1 の実計算。両端を 0 に保った棒の 1 次元拡散 u_t = α u_xx（α = 1、0 ≤ x ≤ 1）を、
// 内部の格子点 16 個（x_i = i/17）で解く。図の数値はすべてここで、ブラウザーの中で計算する
export type Vec = number[];
export type Mat = number[][];

export const N = 16;
export const DX = 1 / (N + 1);
export const XS: Vec = Array.from({ length: N }, (_, i) => (i + 1) * DX);
export const R_BASE = 0.4; // 基準の r = αΔt/Δx²
export const dtOf = (r: number) => r * DX * DX;

// ---- 乱数（種を固定した mulberry32）と行列の小道具 ----
export function rng(seed: number) {
	let a = seed;
	return () => {
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
export function gauss(r: () => number) {
	let u = 0;
	while (!u) u = r();
	return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
}
export const mv = (A: Mat, x: Vec): Vec => A.map((row) => row.reduce((s, a, j) => s + a * x[j], 0));
export const mm = (A: Mat, B: Mat): Mat => A.map((row) => B[0].map((_, j) => row.reduce((s, a, k) => s + a * B[k][j], 0)));
export const eye = (n = N): Mat => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => +(i === j)));
export const rmsOf = (a: Vec) => Math.sqrt(a.reduce((s, v) => s + v * v, 0) / a.length);
export const rmsDiff = (a: Vec, b: Vec) => Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0) / a.length);
const transpose = (A: Mat): Mat => A[0].map((_, j) => A.map((r) => r[j]));

// 連立一次方程式 Ax = b（部分ピボットのガウス消去）。b は複数列でもよい
function solve(A: Mat, B: Mat): Mat {
	const n = A.length, q = B[0].length;
	const M = A.map((r, i) => [...r, ...B[i]]);
	for (let c = 0; c < n; c++) {
		let p = c;
		for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
		[M[c], M[p]] = [M[p], M[c]];
		for (let r = c + 1; r < n; r++) {
			const f = M[r][c] / M[c][c];
			if (f) for (let j = c; j < n + q; j++) M[r][j] -= f * M[c][j];
		}
	}
	const X = Array.from({ length: n }, () => Array(q).fill(0));
	for (let k = 0; k < q; k++)
		for (let i = n - 1; i >= 0; i--) {
			let s = M[i][n + k];
			for (let j = i + 1; j < n; j++) s -= M[i][j] * X[j][k];
			X[i][k] = s / M[i][i];
		}
	return X;
}

// 最小二乗：min Σ‖W x − y‖² + λ‖W‖²。X は入力を並べた行列（行が 1 組）。W（q×p）を返す
export function lstsq(X: Mat, Y: Mat, lam: number): Mat {
	const p = X[0].length, q = Y[0].length;
	const G = Array.from({ length: p }, () => Array(p).fill(0));
	const B = Array.from({ length: p }, () => Array(q).fill(0));
	for (let m = 0; m < X.length; m++) {
		const x = X[m], y = Y[m];
		for (let i = 0; i < p; i++) {
			for (let j = 0; j < p; j++) G[i][j] += x[i] * x[j];
			for (let k = 0; k < q; k++) B[i][k] += x[i] * y[k];
		}
	}
	for (let i = 0; i < p; i++) G[i][i] += lam;
	return transpose(solve(G, B));
}

// ---- 従来の解法 ----
// 陽解法（前進 Euler 法＋中心差分）の 1 ステップ：u_i' = u_i + r(u_{i−1} − 2u_i + u_{i+1})
export const explicitA = (r: number): Mat =>
	Array.from({ length: N }, (_, i) => Array.from({ length: N }, (_, j) => (i === j ? 1 - 2 * r : Math.abs(i - j) === 1 ? r : 0)));

// 学習データを作る解法：Δt を m 等分した陽解法（1 回あたり r/m ≤ 0.1）
export const substeps = (r: number) => Math.max(1, Math.ceil(r / 0.1 - 1e-9));
export function solverStep(r: number): Mat {
	const a = explicitA(r / substeps(r));
	let M = eye();
	for (let s = 0; s < substeps(r); s++) M = mm(a, M);
	return M;
}

// 行列を繰り返し掛けたときの伸び率（スペクトル半径）。‖Wᵏv‖ の伸びから求める
export function growth(W: Mat): number {
	let v = XS.map((x, i) => Math.sin(7.3 * x) + 0.37 * Math.cos(3.1 * i) + 0.11);
	let logSum = 0;
	for (let k = 0; k < 400; k++) {
		const w = mv(W, v);
		const n = rmsOf(w) / rmsOf(v);
		if (k >= 200) logSum += Math.log(n);
		const s = rmsOf(w);
		v = w.map((x) => x / s);
	}
	return Math.exp(logSum / 200);
}

// ---- 温度の分布 ----
// 熱い所が 1 つ（中心 c、幅 w、高さ a のガウス形）
export const bumpFn = (c: number, w: number, a = 1) => (x: number) => a * Math.exp(-(((x - c) / w) ** 2));
export const TEST_FN = bumpFn(0.5, 0.12);
export const TEST_U0: Vec = XS.map(TEST_FN);

// 学習データ：ランダムな位置・幅・高さの熱い所から、解法で K ステップ進めた軌跡（種 1）
export function trajectories(r: number, nTraj: number, K: number, seed = 1): Vec[][] {
	const R = rng(seed), P = solverStep(r), out: Vec[][] = [];
	for (let n = 0; n < nTraj; n++) {
		let u = XS.map(bumpFn(0.15 + 0.7 * R(), 0.05 + 0.1 * R(), 0.5 + 0.5 * R()));
		const tr = [u];
		for (let k = 0; k < K; k++) tr.push((u = mv(P, u)));
		out.push(tr);
	}
	return out;
}
// 方程式だけで学ぶときの入力：熱い所をランダムに置いただけの分布（解法は動かさない）
function randomStates(n: number, seed = 1): Vec[] {
	const R = rng(seed);
	return Array.from({ length: n }, () => XS.map(bumpFn(0.15 + 0.7 * R(), 0.05 + 0.1 * R(), 0.5 + 0.5 * R())));
}

// ---- 学習する写像 ①：1 ステップの行列 W（帯：点 i の次の値を、点 i とその左右の今の値から決める） ----
export type Output = 'state' | 'delta';
export type Teacher = 'data' | 'equation';
export type Loss = 'one' | 'multi';
export interface FitOptions {
	r?: number;
	nTraj?: number; // 学習データの軌跡の本数
	sigma?: number; // 入力に加える雑音の標準偏差
	output?: Output;
	teacher?: Teacher;
	loss?: Loss;
}
export const K_TRAJ = 8; // 軌跡 1 本のステップ数
export const COPIES = 8; // 雑音を加えるとき、1 組から作る複製の数
export const UNROLL = 4; // 多ステップの損失で進めるステップ数
export const LAMBDA = 1e-4; // 解を一つに決めるための小さな正則化（目標を正規化した単位）

// 行ごとに 3 つの係数を最小二乗で決める。目標は全体の RMS で割って正規化する
function bandFit(X: Vec[], Y: Vec[]): Mat {
	const s = Math.sqrt(Y.reduce((a, y) => a + y.reduce((b, v) => b + v * v, 0), 0) / (Y.length * N)) || 1;
	const W = Array.from({ length: N }, () => Array(N).fill(0));
	for (let i = 0; i < N; i++) {
		const idx = [i - 1, i, i + 1].filter((j) => j >= 0 && j < N);
		const c = lstsq(X.map((x) => idx.map((j) => x[j])), Y.map((y) => [y[i] / s]), LAMBDA)[0];
		idx.forEach((j, a) => (W[i][j] = c[a] * s));
	}
	return W;
}

// 学習した 1 ステップの写像を、状態 → 次の状態の行列 B として返す
export function fitStep(o: FitOptions = {}): Mat {
	const { r = R_BASE, nTraj = 8, sigma = 0, output = 'delta', teacher = 'data', loss = 'one' } = o;
	const R = rng(99);
	const noisy = (x: Vec) => (sigma > 0 ? x.map((v) => v + sigma * gauss(R)) : x);
	const copies = sigma > 0 ? COPIES : 1;
	const target = (xIn: Vec, y: Vec) => (output === 'state' ? y : y.map((v, i) => v - xIn[i]));
	const toB = (W: Mat) => (output === 'state' ? W : W.map((row, i) => row.map((v, j) => v + (i === j ? 1 : 0))));
	const A = explicitA(r);
	// 組 (入力, 何ステップ先の正解か) を作る
	type Sample = { x0: Vec; y: Vec; k: number };
	const samples: Sample[] = [];
	if (teacher === 'data') {
		for (const tr of trajectories(r, nTraj, K_TRAJ))
			for (let k = 0; k < K_TRAJ; k++) {
				samples.push({ x0: tr[k], y: tr[k + 1], k: 1 });
				if (loss === 'multi' && k + UNROLL <= K_TRAJ) samples.push({ x0: tr[k], y: tr[k + UNROLL], k: UNROLL });
			}
	} else {
		// 方程式だけ：正解の代わりに、陽解法の差分式が成り立つ値 Au を目標にする（u の後の値は使わない）
		for (const u of randomStates(nTraj * K_TRAJ)) {
			samples.push({ x0: u, y: mv(A, u), k: 1 });
			if (loss === 'multi') {
				let y = u;
				for (let j = 0; j < UNROLL; j++) y = mv(A, y);
				samples.push({ x0: u, y, k: UNROLL });
			}
		}
	}
	const build = (B: Mat | null) => {
		const X: Vec[] = [], Y: Vec[] = [];
		for (const s of samples) {
			if (s.k > 1 && !B) continue;
			for (let c = 0; c < copies; c++) {
				let x = noisy(s.x0);
				// 多ステップ：途中の k−1 ステップは今のモデルで進め、その予測を入力にする（その部分は係数を動かさない）
				for (let j = 0; j < s.k - 1; j++) x = mv(B!, x);
				X.push(x);
				Y.push(target(x, s.y));
			}
		}
		return toB(bandFit(X, Y));
	};
	let B = build(null);
	if (loss === 'multi') for (let it = 0; it < 3; it++) B = build(B);
	return B;
}

export function rollout(B: Mat, u0: Vec, steps: number): Vec[] {
	const out = [u0];
	for (let k = 0; k < steps; k++) out.push(mv(B, out[k]));
	return out;
}

// 1 ステップの誤差：学習と同じ分布の別の軌跡（種 2）で、正解の状態から 1 ステップ進めたずれの RMS
export function oneStepError(B: Mat, r = R_BASE): number {
	let s = 0, c = 0;
	for (const tr of trajectories(r, 10, K_TRAJ, 2))
		for (let k = 0; k < K_TRAJ; k++) {
			s += rmsDiff(mv(B, tr[k]), tr[k + 1]) ** 2;
			c++;
		}
	return Math.sqrt(s / c);
}

// ---- 学習する写像 ②：解演算子 G_n（初期分布 → n ステップ後の分布を 1 回で出す 16×16 の行列） ----
export const OP_PAIRS = 32; // 1 つの時刻あたりの学習の組の数
export function fitOperators(r: number, steps: number): Mat[] {
	const trs = trajectories(r, OP_PAIRS, steps, 5);
	const G: Mat[] = [eye()];
	for (let n = 1; n <= steps; n++) G.push(lstsq(trs.map((t) => t[0]), trs.map((t) => t[n]), 1e-6));
	return G;
}

// ---- 正解 ----
// 格子点 16 個の上の正解は、細かい刻みの解法で進めた値
export const reference = (r: number, u0: Vec, steps: number) => rollout(solverStep(r), u0, steps);

// ---- 学習する写像 ③：解そのもの u(x, t) を表す小さなネットワーク（PINN） ----
// u(x, s) = c₀ + Σ_j c_j tanh(a_j x + b_j s + d_j)、s = t/T。損失は、コロケーション点での方程式の残差と、
// 初期条件・境界条件のずれの 2 乗和。データ（解法の結果）は使わない。Levenberg–Marquardt 法で最小化する
export const PINN_H = 24;
export const PINN_ITERS = 300;
export const PINN_NF = 200;
export interface Pinn {
	theta: number[];
	T: number;
	loss: number[];
	iter: number;
	done: boolean;
}
export function pinnValue(p: Pinn, x: number, t: number): number {
	const th = p.theta, H = (th.length - 1) / 4;
	let v = th[th.length - 1];
	for (let j = 0; j < H; j++) v += th[4 * j + 3] * Math.tanh(th[4 * j] * x + th[4 * j + 1] * (t / p.T) + th[4 * j + 2]);
	return v;
}
export function pinnStart(T: number, u0: (x: number) => number, seed = 3) {
	const R = rng(seed), H = PINN_H, P = 4 * H + 1;
	const th: number[] = [];
	for (let j = 0; j < H; j++) {
		const a = (R() < 0.5 ? -1 : 1) * (2 + 6 * R()), b = gauss(R) * 2, xc = R(), sc = R();
		th.push(a, b, -a * xc - b * sc, gauss(R) * 0.1);
	}
	th.push(0);
	const col: [number, number][] = Array.from({ length: PINN_NF }, () => [R(), R()]);
	const ic: [number, number][] = Array.from({ length: 33 }, (_, i) => [i / 32, 0]);
	const bc: [number, number][] = [];
	for (let i = 0; i < 17; i++) bc.push([0, i / 16], [1, i / 16]);
	const W_IC = 3; // 初期・境界の項の重み
	const resid = (th: number[], wantJ: boolean): [number[], number[][]] => {
		const r: number[] = [], J: number[][] = [];
		for (const [x, s] of col) {
			let us = 0, uxx = 0;
			const g = Array(P).fill(0);
			for (let j = 0; j < H; j++) {
				const a = th[4 * j], b = th[4 * j + 1], c = th[4 * j + 3];
				const z = Math.tanh(a * x + b * s + th[4 * j + 2]);
				const s1 = 1 - z * z, s2 = -2 * z * s1, s3 = -2 * (s1 * s1 + z * s2);
				us += c * b * s1;
				uxx += c * a * a * s2;
				if (wantJ) {
					g[4 * j] = c * (b * s2 * x - T * (2 * a * s2 + a * a * s3 * x));
					g[4 * j + 1] = c * (s1 + b * s2 * s - T * a * a * s3 * s);
					g[4 * j + 2] = c * (b * s2 - T * a * a * s3);
					g[4 * j + 3] = b * s1 - T * a * a * s2;
				}
			}
			// 残差 u_t − α u_xx を T 倍した値（u_s − T u_xx）
			r.push(us - T * uxx);
			if (wantJ) J.push(g);
		}
		const point = (x: number, s: number, target: number) => {
			let u = th[P - 1];
			const g = Array(P).fill(0);
			g[P - 1] = W_IC;
			for (let j = 0; j < H; j++) {
				const c = th[4 * j + 3];
				const z = Math.tanh(th[4 * j] * x + th[4 * j + 1] * s + th[4 * j + 2]);
				const s1 = 1 - z * z;
				u += c * z;
				if (wantJ) {
					g[4 * j] = W_IC * c * s1 * x;
					g[4 * j + 1] = W_IC * c * s1 * s;
					g[4 * j + 2] = W_IC * c * s1;
					g[4 * j + 3] = W_IC * z;
				}
			}
			r.push(W_IC * (u - target));
			if (wantJ) J.push(g);
		};
		for (const [x, s] of ic) point(x, s, u0(x));
		for (const [x, s] of bc) point(x, s, 0);
		return [r, J];
	};
	const sq = (r: number[]) => r.reduce((s, v) => s + v * v, 0);
	const p: Pinn = { theta: th, T, loss: [sq(resid(th, false)[0])], iter: 0, done: false };
	let mu = 1e-2;
	// 1 回の反復：(JᵀJ + μ diag(JᵀJ)) δ = −Jᵀr を解き、損失が下がれば受け入れる
	const step = () => {
		const [r, J] = resid(p.theta, true);
		const A = Array.from({ length: P }, () => Array(P).fill(0)), g = Array(P).fill(0);
		for (let m = 0; m < r.length; m++) {
			const Jm = J[m];
			for (let a = 0; a < P; a++) {
				if (!Jm[a]) continue;
				g[a] += Jm[a] * r[m];
				for (let b = a; b < P; b++) A[a][b] += Jm[a] * Jm[b];
			}
		}
		for (let a = 0; a < P; a++) for (let b = 0; b < a; b++) A[a][b] = A[b][a];
		const L = p.loss[p.loss.length - 1];
		let next = L;
		for (let tries = 0; tries < 10; tries++) {
			const Am = A.map((row, a) => row.map((v, b) => v + (a === b ? mu * (1 + A[a][a]) : 0)));
			const d = solve(Am, g.map((v) => [-v]));
			const cand = p.theta.map((v, i) => v + d[i][0]);
			const Ln = sq(resid(cand, false)[0]);
			if (Ln < L) {
				p.theta = cand;
				next = Ln;
				mu = Math.max(mu / 3, 1e-9);
				break;
			}
			mu *= 4;
		}
		p.loss.push(next);
		p.iter++;
		if (p.iter >= PINN_ITERS) p.done = true;
	};
	return { p, step };
}

// ---- 状態の表し方 ----
// 正弦の基底（離散サイン変換）：S[k][i] = √(2/17) sin((k+1)π x_i)。直交行列なので逆は転置
export const SINE: Mat = Array.from({ length: N }, (_, k) => XS.map((x) => Math.sqrt(2 / (N + 1)) * Math.sin((k + 1) * Math.PI * x)));
export const toModes = (u: Vec) => mv(SINE, u);
export const fromModes = (c: Vec) => XS.map((_, i) => c.reduce((s, ck, k) => s + ck * SINE[k][i], 0));
// 同じ 1 ステップの写像を、正弦の係数の上で表した行列 S P Sᵀ
export const inModes = (P: Mat) => mm(mm(SINE, P), transpose(SINE));

// ばらばらに置いた M 点（種 4）。端の 0 を足して線形補間で戻し、格子点 16 個での誤差を測る
export function scattered(M: number, f: (x: number) => number) {
	const R = rng(4);
	const xs = Array.from({ length: M }, () => 0.02 + 0.96 * R()).sort((a, b) => a - b);
	const vs = xs.map(f);
	const px = [0, ...xs, 1], pv = [0, ...vs, 0];
	const interp = (x: number) => {
		let k = 0;
		while (k < px.length - 2 && px[k + 1] < x) k++;
		const t = (x - px[k]) / (px[k + 1] - px[k]);
		return pv[k] * (1 - t) + pv[k + 1] * t;
	};
	return { xs, vs, interp };
}

// ---- 出力の形 ----
// 1 ステップの組（学習データと同じ分布、種 2）で、目標の大きさ（RMS）を測る
export function targetSizes(r: number) {
	let sState = 0, sDelta = 0, c = 0;
	for (const tr of trajectories(r, 10, K_TRAJ, 2))
		for (let k = 0; k < K_TRAJ; k++) {
			sState += rmsOf(tr[k + 1]) ** 2;
			sDelta += rmsDiff(tr[k + 1], tr[k]) ** 2;
			c++;
		}
	return { state: Math.sqrt(sState / c), delta: Math.sqrt(sDelta / c) };
}
