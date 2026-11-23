// 図 6 の表：主な手法を 4 つの軸で並べる。マスごとに、原論文の節を引用の印で付ける
// 日本語の文字だけを置く。英語版を書くときは en を足す
export type Cell = { text: string; cites: { k: string; at: string }[] };
export type Row = { name: string; paper: string; cells: [Cell, Cell, Cell, Cell] };

const c = (text: string, ...cites: [string, string][]): Cell => ({ text, cites: cites.map(([k, at]) => ({ k, at })) });

export const columns = { ja: ['手法', '近似の対象', '状態の表現と出力', '教師と損失', '推論の方式'] };

export const rows: { ja: Row[] } = {
	ja: [
		{
			name: 'Tompson ら（2017）',
			paper: 'tompson2017',
			cells: [
				c('時間発展の写像のうち、圧力の射影の部分', ['tompson2017', '§3–4']),
				c('格子上の速度の発散と、固体の占有を入力にし、圧力を出力', ['tompson2017', '§4']),
				c('予測した速度の発散の 2 乗を損失にし、正解の圧力は使わない。数ステップ先の発散も足す', ['tompson2017', '§4']),
				c('解法の中で毎ステップ呼ぶ', ['tompson2017', '§4']),
			],
		},
		{
			name: 'PINNs',
			paper: 'raissi2019',
			cells: [
				c('解そのもの u(t, x)', ['raissi2019', 'arXiv 1711.10561 §2']),
				c('座標 (t, x) を入力にし、その点の値を出力', ['raissi2019', 'arXiv 1711.10561 §2']),
				c('コロケーション点での方程式の残差と、初期・境界のデータとのずれ', ['raissi2019', 'arXiv 1711.10561 §2']),
				c('求めたい (t, x) で 1 回評価', ['raissi2019', 'arXiv 1711.10561 §2']),
			],
		},
		{
			name: 'GNS',
			paper: 'sanchez2020',
			cells: [
				c('時間発展の写像', ['sanchez2020', '§3.1']),
				c('粒子を節点とし、接続半径の内側の粒子を辺で結ぶ。出力は加速度', ['sanchez2020', '§4.2']),
				c('解法（SPH、PBD、MPM）の結果の 1 ステップ先の誤差。入力の速度に雑音を加える', ['sanchez2020', '§4.1、§4.3']),
				c('ロールアウト', ['sanchez2020', '§3.1']),
			],
		},
		{
			name: 'MeshGraph­Nets',
			paper: 'pfaff2021',
			cells: [
				c('時間発展の写像', ['pfaff2021', '§3.1']),
				c('メッシュの節点と辺（変形する系では空間的に近い節点の間の辺も足す）。出力は 1 階または 2 階の時間微分で、積分して次の状態にする', ['pfaff2021', '§3.1、§4']),
				c('解法（ArcSim、SU2、COMSOL）の結果の 1 ステップ先の誤差。入力に雑音を加える', ['pfaff2021', 'A.1、A.2.1–A.2.2']),
				c('ロールアウト', ['pfaff2021', '図 1']),
			],
		},
		{
			name: 'FNO',
			paper: 'li2021fno',
			cells: [
				c('解演算子（例：初期条件 → 時刻 1 の解）', ['li2021fno', '§2、§5.1']),
				c('一様な格子。フーリエ変換して低い k_max 個のモードだけに重みを掛ける経路と、点ごとの線形変換の経路を足す', ['li2021fno', '§3 式 (2)、§4']),
				c('数値解法で作った入出力の組', ['li2021fno', '§6、A.3']),
				c('1 回の評価。Navier–Stokes の FNO-2D は 1 ステップずつ繰り返す', ['li2021fno', '§5.1、§5.3']),
			],
		},
		{
			name: 'DeepONet',
			paper: 'lu2021',
			cells: [
				c('解演算子 G(u)(y)', ['lu2021', '§2.1']),
				c('入力の関数は決まった m 点（センサー）の値。出力は位置 y ごとの値', ['lu2021', '§2.1']),
				c('参照解（Runge–Kutta 法、差分法）の組', ['lu2021', '§2.2']),
				c('求めたい y で 1 回評価', ['lu2021', '§2.1']),
			],
		},
		{
			name: 'MP-PDE',
			paper: 'brandstetter2022',
			cells: [
				c('時間発展の写像', ['brandstetter2022', '§3.1']),
				c('格子や不規則な点をグラフにする。出力は先の K ステップ分', ['brandstetter2022', '§3.1、§4.3']),
				c('解法の結果。1 ステップの損失に、2 ステップ進めた先の誤差（pushforward trick）を足す', ['brandstetter2022', '§3.1']),
				c('ロールアウト', ['brandstetter2022', '§3.1']),
			],
		},
		{
			name: 'Transolver',
			paper: 'wu2024',
			cells: [
				c('解演算子（例：車の形 → 周りの速度と表面の圧力）', ['wu2024', '§3、付録 B']),
				c('メッシュの点を、学習したスライスに重みで割り当て、スライスの間で注意を計算', ['wu2024', '§3.1']),
				c('解法の結果の入出力の組', ['wu2024', '§4、付録 B']),
				c('定常の問題は 1 回の評価', ['wu2024', '付録 B']),
			],
		},
	],
};

export const taxonomyCites = () => rows.ja.flatMap((r) => r.cells.flatMap((x) => x.cites.map((y) => y.k)));
