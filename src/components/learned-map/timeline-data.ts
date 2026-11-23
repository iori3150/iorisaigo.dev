// 図 3 の年表（日本語のみ。英語版は書くときに文面ごと作る）。year が 2015 以下のものは左端の「〜2015」の列に置く
// band: 0 縮約モデル, 1 粒子・物体・メッシュ, 2 格子, 3 関数・演算子, 4 注意機構
// slot: 帯の中の段（0〜2）。同じ年の点が重ならないよう手で決める
// problem / change の根拠は problemCites / changeCites、線（from）の根拠は「その手法の論文 paper の節 at」
// 線は、新しい手法の論文が先行研究として本文で挙げている手法にだけ引く。論文が挙げていない関係は引かない
import type { CiteRef } from './refs';

export const bands: string[] = ['縮約モデル', '粒子・物体・メッシュ', '格子', '関数・演算子', '注意機構'];

export type Item = {
	id: string;
	year: number;
	band: number;
	slot: number;
	label: string;
	paper: string;
	name: string;
	problem: string;
	problemCites: CiteRef[];
	change: string;
	changeCites: CiteRef[];
	from: { id: string; at: string }[];
};

export const items: Item[] = [
	{
		id: 'pod', year: 1987, band: 0, slot: 0, label: 'POD', paper: 'berkooz1993',
		name: 'POD（固有直交分解: Proper Orthogonal Decomposition）による縮約（Sirovich 1987、Berkooz ら 1993）',
		problem: '', problemCites: [],
		change: '多数の信号（流れ場のスナップショットなど）から直交する基底（モード）を求め、モードへの射影（Galerkin 射影）で得た方程式を時間発展させる',
		changeCites: [{ k: 'berkooz1993', at: '§1.3、§4' }, { k: 'sirovich1987' }],
		from: [],
	},
	{
		id: 'barbic', year: 2005, band: 0, slot: 1, label: 'Barbič', paper: 'barbic2005',
		name: '部分空間の積分（Barbič と James、2005）',
		problem: '大変形の計算が重く、触覚提示の更新頻度では扱いにくい', problemCites: [{ k: 'barbic2005', at: '§1、§2' }],
		change: '変位を部分空間に限り、運動方程式を部分空間に射影して、その中で積分する。縮約した内力は 3 次の多項式で、係数を事前に計算する', changeCites: [{ k: 'barbic2005', at: '§3.3、§4' }],
		from: [],
	},
	{
		id: 'treuille', year: 2006, band: 0, slot: 2, label: 'Treuille', paper: 'treuille2006',
		name: '流体の縮約（Treuille ら、2006）',
		problem: '著者によれば、高解像度の流体を実時間で計算できる手法が無かった', problemCites: [{ k: 'treuille2006', at: '§1、§2' }],
		change: '流体の速度場のスナップショットから基底を作り、基底の係数を時間発展させる。煙などはその速度場で動かし、実時間で動かす', changeCites: [{ k: 'treuille2006', at: '§4、§5' }],
		from: [{ id: 'pod', at: '§2' }, { id: 'barbic', at: '§2' }],
	},
	{
		id: 'chen', year: 1995, band: 3, slot: 1, label: 'Chen & Chen', paper: 'chen1995',
		name: 'ニューラルネットワークによる演算子の近似（Chen と Chen、1995）',
		problem: '', problemCites: [],
		change: '隠れ層 1 層のネットワークが、コンパクトな集合上の連続な非線形演算子を任意の精度で近似できることを示した（DeepONet の論文による要約）', changeCites: [{ k: 'lu2021', at: '§1' }, { k: 'chen1995' }],
		from: [],
	},
	{
		id: 'lagaris', year: 1998, band: 3, slot: 0, label: 'Lagaris', paper: 'lagaris1998',
		name: 'ニューラルネットワークによる微分方程式の解法（Lagaris ら、1998）',
		problem: '', problemCites: [],
		change: '境界条件を満たすように組み立てた試行解（境界条件を満たす項とネットワークの項の和）を、方程式の残差が小さくなるように学習させる', changeCites: [{ k: 'lagaris1998', at: '§2（arXiv 版）' }],
		from: [],
	},
	{
		id: 'ladicky', year: 2015, band: 1, slot: 0, label: 'Ladický', paper: 'ladicky2015',
		name: '回帰森による流体シミュレーション（Ladický ら、2015）',
		problem: '従来の流体計算は、安定のために時間刻みを小さくする必要があり、計算資源を多く使う', problemCites: [{ k: 'ladicky2015' }],
		change: '粒子ごとの特徴量から加速度を、回帰森（複数の決定木の予測を組み合わせる回帰法）で予測する', changeCites: [{ k: 'ladicky2015' }],
		from: [],
	},
	{
		id: 'in', year: 2016, band: 1, slot: 1, label: 'Interaction Networks', paper: 'battaglia2016',
		name: 'Interaction Networks（Battaglia ら、2016）',
		problem: '', problemCites: [],
		change: '物体と関係のグラフで、関係ごとの作用を計算するネットワークと、物体ごとの更新を計算するネットワークを学習する。どの物体どうしが関係を持つかは、入力として与える',
		changeCites: [{ k: 'battaglia2016', at: '§2' }, { k: 'chang2017', at: '§4' }],
		from: [{ id: 'ladicky', at: '§1' }],
	},
	{
		id: 'tompson', year: 2017, band: 2, slot: 0, label: 'Tompson', paper: 'tompson2017',
		name: 'CNN による圧力投影（Tompson ら、2017）。CNN は畳み込みニューラルネットワーク（Convolutional Neural Network）',
		problem: '格子の流体で、圧力投影（ポアソン方程式で圧力を求め、速度を修正する操作）が、計算の中で最も重い', problemCites: [{ k: 'tompson2017', at: '§3' }],
		change: '圧力投影の線形ソルバーだけを CNN で置き換える。正解の圧力は使わず、投影後の速度場の発散を損失にする', changeCites: [{ k: 'tompson2017', at: '§4' }],
		from: [{ id: 'ladicky', at: '§2' }, { id: 'treuille', at: '§2' }],
	},
	{
		id: 'spnets', year: 2018, band: 1, slot: 0, label: 'SPNets', paper: 'schenck2018',
		name: 'SPNets（Smoothed Particle Networks）（Schenck と Fox、2018）',
		problem: 'Interaction Networks は剛体と、重力・磁力・ばねなどの力が中心で、流体を扱っていない。Ladický らの手法は、粒子間の相互作用を計算するのに、手作りの特徴量が要る',
		problemCites: [{ k: 'schenck2018', at: '§2' }],
		change: '位置ベース流体（PBF: Position Based Fluids）の計算を、微分可能な層としてネットワークに書く。物性値が層の重みになる', changeCites: [{ k: 'schenck2018', at: '§4' }],
		from: [{ id: 'in', at: '§2' }, { id: 'ladicky', at: '§2' }],
	},
	{
		id: 'dpi', year: 2019, band: 1, slot: 1, label: 'DPI-Net', paper: 'li2019dpi',
		name: 'DPI-Net（Dynamic Particle Interaction Networks）（Li ら、2019）',
		problem: 'Interaction Networks は毎ステップ局所の情報だけを見るので、力の瞬時の伝播を扱えない。比較実験では全粒子を結ぶグラフを使うので、粒子が多いとメモリに載らない',
		problemCites: [{ k: 'li2019dpi', at: '§4' }],
		change: '粒子の近傍から動的にグラフを作り、多段のメッセージ伝播で、剛体、変形体、流体を扱う。階層的な粒子の構造は、剛体と変形体に使う（流体は近傍の動的なグラフだけ）。学習した動力学を、ロボットの操作の計画に使う', changeCites: [{ k: 'li2019dpi', at: '§3.1、§3.2、§4.3' }],
		from: [{ id: 'in', at: '§1' }, { id: 'spnets', at: '§2' }],
	},
	{
		id: 'deepfluids', year: 2019, band: 2, slot: 1, label: 'Deep Fluids', paper: 'kim2019',
		name: 'Deep Fluids（Kim ら、2019）',
		problem: '多くの縮約手法が使う、特異値分解などで求めた線形な基底は、非線形な表現より効率が悪い', problemCites: [{ k: 'kim2019', at: '§1' }],
		change: 'パラメーター（例：煙の位置）から速度場を生成するネットワークを学習する', changeCites: [{ k: 'kim2019', at: '§1' }],
		from: [{ id: 'treuille', at: '§2' }, { id: 'tompson', at: '§2' }, { id: 'ladicky', at: '§2' }],
	},
	{
		id: 'pinns', year: 2019, band: 3, slot: 2, label: 'PINNs', paper: 'raissi2019',
		name: 'PINNs（Physics-Informed Neural Networks）（Raissi ら、2019）',
		problem: '', problemCites: [],
		change: '方程式の残差（解を代入したときの左辺と右辺の差）と、初期条件・境界条件・観測データとの差を損失にして、ネットワークを学習する。方程式の未知の係数を観測から推定する逆問題にも使う',
		changeCites: [{ k: 'raissi2019', at: 'arXiv 1711.10561 §2.1、1711.10566 §2.1' }],
		from: [],
	},
	{
		id: 'cconv', year: 2020, band: 1, slot: 2, label: 'Ummenhofer', paper: 'ummenhofer2020',
		name: '連続畳み込み（Ummenhofer ら、2020）',
		problem: 'Ummenhofer らによると、グラフを使う手法では、辺があるかどうかで、2 粒子が相互作用するかを 2 値で決める', problemCites: [{ k: 'ummenhofer2020', at: '§1' }],
		change: '粒子の点群の上の連続畳み込みで、カーネル（粒子の影響の重みを表す関数）を相対位置の関数として学習する', changeCites: [{ k: 'ummenhofer2020', at: '§4、§5' }],
		from: [{ id: 'dpi', at: '§6' }, { id: 'spnets', at: '§6' }, { id: 'ladicky', at: '§2' }],
	},
	{
		id: 'gns', year: 2020, band: 1, slot: 0, label: 'GNS', paper: 'sanchez2020',
		name: 'GNS（Graph Network-based Simulator）（Sanchez-Gonzalez ら、2020）',
		problem: '先行する DPI-Net と連続畳み込みは、特定のタスクに特化している', problemCites: [{ k: 'sanchez2020', at: '§1' }],
		change: 'DPI-Net と連続畳み込みの考えを、メッセージパッシングを重ねた一つの枠組みにまとめ、流体、剛体、変形体を学習する。学習時の入力にノイズを加える', changeCites: [{ k: 'sanchez2020', at: '§2、§4.3' }],
		from: [{ id: 'dpi', at: '§2' }, { id: 'cconv', at: '§2' }],
	},
	{
		id: 'mgn', year: 2021, band: 1, slot: 1, label: 'MeshGraphNets', paper: 'pfaff2021',
		name: 'MeshGraphNets（Pfaff ら、2021）',
		problem: 'GNS には無変形時の基準形状の概念がなく、布のロールアウトで誤差が大きくなって不安定になる。固定した半径は、不均一なメッシュで、細かい所に辺を取りすぎ、粗い所に取らなさすぎる', problemCites: [{ k: 'pfaff2021', at: '§5' }],
		change: 'メッシュの辺をグラフにし、メッシュ上で遠くても空間で近い点どうしの辺を別に足す。布、構造体、流体を同じ枠組みで学習する', changeCites: [{ k: 'pfaff2021', at: '§3' }],
		from: [{ id: 'gns', at: '§5' }],
	},
	{
		id: 'deeponet', year: 2021, band: 3, slot: 0, label: 'DeepONet', paper: 'lu2021',
		name: 'DeepONet（Deep Operator Network）（Lu ら、2021）',
		problem: 'Chen と Chen の定理は近似誤差しか保証せず、最適化と汎化の誤差を扱わない', problemCites: [{ k: 'lu2021', at: '§1' }],
		change: '入力関数を読む branch ネットワーク（入力関数側）と、出力の評価点を読む trunk ネットワーク（評価座標側）の出力の内積で、入力関数から出力関数への写像を表す', changeCites: [{ k: 'lu2021', at: '§2.1' }],
		from: [{ id: 'chen', at: '§1' }],
	},
	{
		id: 'fno', year: 2021, band: 3, slot: 2, label: 'FNO', paper: 'li2021fno',
		name: 'FNO（Fourier Neural Operator）（Li ら、2021）',
		problem: 'FNO の論文によると、PINNs などは方程式の特定の 1 例の解を求めるので、新しい条件ごとにネットワークを学習し直す', problemCites: [{ k: 'li2021fno', at: '§1、§2' }],
		change: '場をフーリエ変換し、低い波数（粗い空間パターン）の成分に学習した重みを掛けて戻す層を重ねる。FFT（高速フーリエ変換）を使う実装では、離散化に一様な格子が要る', changeCites: [{ k: 'li2021fno', at: '§4' }],
		from: [{ id: 'pinns', at: '§1' }],
	},
	{
		id: 'transolver', year: 2024, band: 4, slot: 0, label: 'Transolver', paper: 'wu2024',
		name: 'Transolver（Wu ら、2024）',
		problem: 'メッシュの全点が互いを参照する自己注意（self-attention）は、数万点の不規則な点では計算量が 2 次で大きすぎる。グラフカーネル（グラフ上の畳み込み）は大域の情報を学びにくい', problemCites: [{ k: 'wu2024', at: '§1、§2.1' }],
		change: 'メッシュの点を、学習で決めた少数のスライスに割り当て、スライスごとに集めた特徴量（トークン）の間で注意を取る', changeCites: [{ k: 'wu2024', at: '§3.1、§3.2' }],
		from: [{ id: 'fno', at: '§2.1' }, { id: 'mgn', at: '§2.2' }],
	},
	{
		id: 'worldparticle', year: 2026, band: 4, slot: 2, label: 'WorldParticle', paper: 'wang2026',
		name: 'WorldParticle（Wang ら、2026）',
		problem: 'メッセージパッシングでは、大域の情報が多くのホップを経て伝わる。縮約モデルの基底は、特定の形状の族に結びつく', problemCites: [{ k: 'wang2026', at: '§1、§2' }],
		change: '外力だけを陽的に（現在の状態から直接計算して）積分した予測に、粒子間の相互作用による修正をネットワークで足す。修正は、学習するカーネルで集めた近傍の特徴量から、自己注意とトークンの統合を繰り返して作るスーパートークン（少数の特徴量）で大域の情報を伝えて作る。現象ごとに同じ構成のネットワークを学習する', changeCites: [{ k: 'wang2026', at: '§3.1、§3.2、§3.4' }],
		from: [{ id: 'in', at: '§2' }, { id: 'cconv', at: '§2' }, { id: 'gns', at: '§2' }, { id: 'treuille', at: '§1' }],
	},
];
