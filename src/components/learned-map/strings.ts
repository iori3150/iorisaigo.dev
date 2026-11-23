// IV-0「地図」の図で使う文字。英語版の MDX からも同じ部品を lang='en' で呼ぶ
export type Lang = 'ja' | 'en';

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

// 図 6 の見取り図
export const schools = {
	ja: {
		rowHead: '入力の表し方',
		colHead: '物理の入れ方',
		rows: ['粒子', 'メッシュ', '格子', '座標と関数'],
		cols: ['構造', '損失', 'どちらにも入れない'],
	},
	en: {
		rowHead: 'Input',
		colHead: 'Where physics goes',
		rows: ['Particles', 'Mesh', 'Grid', 'Coordinates, functions'],
		cols: ['Architecture', 'Loss', 'Neither'],
	},
};

// [行, 列, 手法名, 何を入れたか]
export const schoolCells: Record<Lang, [number, number, string, string][]> = {
	ja: [
		[0, 0, 'SPNets', 'SPH の計算を層に'],
		[0, 0, 'Ummenhofer ら', '学習するカーネルの畳み込み'],
		[0, 0, 'GNS', '相対位置と近傍グラフ'],
		[0, 0, 'WorldParticle', '外力の積分と修正の分離'],
		[0, 1, 'WorldParticle', '流体の発散'],
		[1, 0, 'MeshGraphNets', 'メッシュの辺'],
		[1, 2, 'Transolver', ''],
		[2, 0, 'Tompson ら', '圧力投影だけ置き換え'],
		[2, 1, 'Tompson ら', '投影後の速度の発散'],
		[2, 2, 'FNO', ''],
		[3, 1, 'PINNs', '支配方程式の残差'],
		[3, 2, 'DeepONet', ''],
	],
	en: [
		[0, 0, 'SPNets', 'SPH as layers'],
		[0, 0, 'Ummenhofer et al.', 'learned-kernel convolution'],
		[0, 0, 'GNS', 'relative positions, neighbor graph'],
		[0, 0, 'WorldParticle', 'external force integrated separately'],
		[0, 1, 'WorldParticle', 'fluid divergence'],
		[1, 0, 'MeshGraphNets', 'mesh edges'],
		[1, 2, 'Transolver', ''],
		[2, 0, 'Tompson et al.', 'replaces only the pressure projection'],
		[2, 1, 'Tompson et al.', 'divergence after projection'],
		[2, 2, 'FNO', ''],
		[3, 1, 'PINNs', 'PDE residual'],
		[3, 2, 'DeepONet', ''],
	],
};
