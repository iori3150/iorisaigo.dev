// IV-0 の図で使う文字。英語版の MDX からも同じ部品を lang='en' で呼ぶ
export type Lang = 'ja' | 'en';
import type { CiteRef } from './refs';

export const ui = {
	ja: {
		play: '再生',
		pause: '停止',
		step: 'ステップ',
		hops: '段数',
		reached: '届いた点',
		allReached: '全点に届く段数',
		points: '点の数',
		neighbors: '近傍の数',
		truth: '正解（ソルバー）',
		model: '学習モデル（3 次多項式）',
		error: '状態のずれ',
		angle: '角度',
		costAttn: '注意（1 層）',
		costMp: 'メッセージパッシング（1 段）',
		costMpReach: 'メッセージパッシング（端まで届く段数）',
		pairs: '計算する組の数',
		problem: '困っていたこと',
		change: '変えたこと',
		before: '前の手法',
		pre2016: '〜2015',
		solver: '流体ソルバー（圧力投影を含む例）',
		learned: '学習モデル（GNS）',
		repeat: 'n を 1 進めて繰り返す',
	},
	en: {
		play: 'Play',
		pause: 'Pause',
		step: 'Step',
		hops: 'Layers',
		reached: 'Reached',
		allReached: 'Layers to reach all',
		points: 'Points',
		neighbors: 'Neighbors',
		truth: 'Ground truth (solver)',
		model: 'Learned model (cubic polynomial)',
		error: 'State error',
		angle: 'Angle',
		costAttn: 'Attention (1 layer)',
		costMp: 'Message passing (1 layer)',
		costMpReach: 'Message passing (layers to cross)',
		pairs: 'Pairs computed',
		problem: 'Problem',
		change: 'Change',
		before: 'Builds on',
		pre2016: '–2015',
		solver: 'Fluid solver (with pressure projection)',
		learned: 'Learned model (GNS)',
		repeat: 'Advance n and repeat',
	},
} as const;

// 図 1 の箱（1 要素が 1 行）
export const stepBoxes = {
	ja: {
		solver: [['近傍の値から', '離散化した式を組む'], ['線形系を反復法で解く', '（圧力など）'], ['状態を更新']],
		learned: [['エンコード', '（点と辺を特徴量に）'], ['メッセージパッシング', 'M 段'], ['デコード（加速度）', 'と積分']],
	},
	en: {
		solver: [['Assemble discretized', 'equations from neighbors'], ['Solve a linear system', 'iteratively (pressure)'], ['Update state']],
		learned: [['Encode points', 'and edges'], ['M message-passing', 'layers'], ['Decode acceleration,', 'integrate']],
	},
};

// 図 6 の分類（日本語のみ）
export const schools = {
	rowHead: '入力の表し方',
	colHead: '物理の入れ方',
	rows: ['粒子', 'メッシュ', '格子', '座標と関数'],
	cols: ['構造', '損失', 'どちらにも入れない'],
};

// [行, 列, 手法名, 何を入れたか, 根拠]
export const schoolCells: [number, number, string, string, CiteRef[]][] = [
	[0, 0, 'SPNets', 'PBF（Position Based Fluids）の計算を層に', [{ k: 'schenck2018', at: '§4' }]],
	[0, 0, 'Ummenhofer ら', '学習するカーネルの連続畳み込み', [{ k: 'ummenhofer2020', at: '§4、§5' }]],
	[0, 0, 'GNS', '相対位置と近傍グラフ', [{ k: 'sanchez2020', at: '§4.2、§5.4' }]],
	[0, 0, 'WorldParticle', '外力の積分と修正の分離', [{ k: 'wang2026', at: '§3、§3.1' }]],
	[0, 1, 'WorldParticle', '流体の速度場の発散を損失に追加（任意）', [{ k: 'wang2026', at: '§3.4' }]],
	[1, 0, 'MeshGraphNets', 'メッシュの辺', [{ k: 'pfaff2021', at: '§3' }]],
	[1, 2, 'Transolver', '相対 L2 損失（予測と正解の差のノルムを正解のノルムで割った量。Darcy 流れの問題では勾配の項を追加）', [{ k: 'wu2024', at: '付録 B.3' }]],
	[2, 0, 'Tompson ら', '圧力投影だけ置き換え', [{ k: 'tompson2017', at: '§3、§4' }]],
	[2, 1, 'Tompson ら', '投影後の速度の発散', [{ k: 'tompson2017', at: '§4' }]],
	[2, 2, 'FNO', '予測と正解を比べる費用関数', [{ k: 'li2021fno', at: '§2' }]],
	[3, 1, 'PINNs', '支配方程式の残差', [{ k: 'raissi2019', at: 'arXiv 1711.10561 §2.1' }]],
	[3, 2, 'DeepONet', '予測と正解の平均二乗誤差', [{ k: 'lu2021', at: '§2.2、§4' }]],
];
