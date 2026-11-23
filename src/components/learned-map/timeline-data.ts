// 図 3 の年表。year が 2015 以下のものは左端の「〜2015」の列に置く
// band: 0 縮約モデル, 1 粒子・物体・メッシュ, 2 格子, 3 関数・演算子, 4 注意機構
// slot: 帯の中の段（0〜2）。同じ年の点が重ならないよう手で決める
import type { Lang } from './strings';

export const bands: Record<Lang, string[]> = {
	ja: ['縮約モデル', '粒子・物体・メッシュ', '格子', '関数・演算子', '注意機構'],
	en: ['Reduced-order', 'Particles, objects, meshes', 'Grids', 'Functions, operators', 'Attention'],
};

type Item = {
	id: string;
	year: number;
	band: number;
	slot: number;
	label: string;
	from: string[];
	text: Record<Lang, { name: string; problem: string; change: string }>;
};

export const items: Item[] = [
	{
		id: 'pod', year: 1987, band: 0, slot: 0, label: 'POD', from: [],
		text: {
			ja: { name: 'POD による縮約（Sirovich 1987、Berkooz ら 1993）', problem: '流れ場の自由度が大きすぎる', change: '流れ場を少数のモードに分解し、モードの係数だけを時間発展させる' },
			en: { name: 'Reduction by POD (Sirovich 1987; Berkooz et al. 1993)', problem: 'Too many degrees of freedom in the flow field', change: 'Decompose the field into a few modes and evolve only their coefficients' },
		},
	},
	{
		id: 'barbic', year: 2005, band: 0, slot: 1, label: 'Barbič', from: ['pod'],
		text: {
			ja: { name: '部分空間の積分（Barbič と James、2005）', problem: '変形体の計算が実時間で回らない', change: '運動を部分空間に射影して積分する' },
			en: { name: 'Subspace integration (Barbič & James, 2005)', problem: 'Deformable bodies do not run in real time', change: 'Project the motion onto a subspace and integrate there' },
		},
	},
	{
		id: 'treuille', year: 2006, band: 0, slot: 2, label: 'Treuille', from: ['pod'],
		text: {
			ja: { name: '流体の縮約（Treuille ら、2006）', problem: '流体の計算が実時間で回らない', change: '流体のスナップショットから基底を作り、実時間で煙を動かす' },
			en: { name: 'Model reduction for fluids (Treuille et al., 2006)', problem: 'Fluids do not run in real time', change: 'Build a basis from fluid snapshots and animate smoke in real time' },
		},
	},
	{
		id: 'lagaris', year: 1998, band: 3, slot: 0, label: 'Lagaris', from: [],
		text: {
			ja: { name: 'ニューラルネットワークによる微分方程式の解法（Lagaris ら、1998）', problem: '—', change: '解をネットワークで表し、方程式を満たすように学習させる' },
			en: { name: 'Neural networks for differential equations (Lagaris et al., 1998)', problem: '—', change: 'Represent the solution by a network trained to satisfy the equation' },
		},
	},
	{
		id: 'ladicky', year: 2015, band: 1, slot: 0, label: 'Ladický', from: [],
		text: {
			ja: { name: '回帰森による SPH（Ladický ら、2015）', problem: 'SPH の計算が重い', change: '粒子ごとの特徴量から加速度を回帰森で予測する' },
			en: { name: 'SPH with regression forests (Ladický et al., 2015)', problem: 'SPH is expensive', change: 'Predict per-particle acceleration from features with regression forests' },
		},
	},
	{
		id: 'in', year: 2016, band: 1, slot: 1, label: 'Interaction Networks', from: ['treuille'],
		text: {
			ja: { name: 'Interaction Networks（Battaglia ら、NIPS 2016）', problem: '縮約の基底は特定の形状と条件に結びつき、配置を変えると作り直しになる', change: '物体と関係のグラフで、関係ごとの作用と物体ごとの更新を学ぶ。規則が局所なので物体の数を変えても使える' },
			en: { name: 'Interaction Networks (Battaglia et al., NIPS 2016)', problem: 'Reduced bases are tied to one geometry and setup', change: 'Learn per-relation effects and per-object updates on a graph; local rules work for any number of objects' },
		},
	},
	{
		id: 'tompson', year: 2017, band: 2, slot: 0, label: 'Tompson', from: [],
		text: {
			ja: { name: 'CNN による圧力投影（Tompson ら、ICML 2017）', problem: '格子の流体で、圧力のポアソン方程式を毎ステップ解くのが重い', change: '圧力投影の線形ソルバーだけを CNN で置き換える。正解の圧力は使わず、投影後の速度場の発散を損失にする' },
			en: { name: 'CNN pressure projection (Tompson et al., ICML 2017)', problem: 'Solving the pressure Poisson equation every step is expensive', change: 'Replace only the linear solver of the pressure projection with a CNN, trained without ground-truth pressure on the divergence after projection' },
		},
	},
	{
		id: 'spnets', year: 2018, band: 1, slot: 0, label: 'SPNets', from: ['in'],
		text: {
			ja: { name: 'SPNets（Schenck と Fox、CoRL 2018）', problem: 'Interaction Networks では関係を入力として与えるので、相手が入れ替わる流体には別の作り方が要る', change: 'SPH の計算を微分可能な層として書き、ネットワークに組み込む' },
			en: { name: 'SPNets (Schenck & Fox, CoRL 2018)', problem: 'Relations are given by hand; fluids change neighbors constantly', change: 'Write SPH as differentiable layers inside a network' },
		},
	},
	{
		id: 'dpi', year: 2019, band: 1, slot: 1, label: 'DPI-Net', from: ['in'],
		text: {
			ja: { name: 'DPI-Net（Li ら、ICLR 2019）', problem: 'Interaction Networks では関係を入力として与える', change: '粒子の近傍からグラフを作り、剛体、変形体、流体を一つのグラフで扱う。ロボットの操作の計画に使う' },
			en: { name: 'DPI-Net (Li et al., ICLR 2019)', problem: 'Relations were given by hand', change: 'Build the graph from particle neighborhoods; rigid, deformable, and fluid in one graph, used for manipulation planning' },
		},
	},
	{
		id: 'deepfluids', year: 2019, band: 2, slot: 1, label: 'Deep Fluids', from: [],
		text: {
			ja: { name: 'Deep Fluids（Kim ら、2019）', problem: 'パラメーターを変えるたびにシミュレーションを回し直す', change: 'パラメーターから速度場を生成するネットワークを学習する' },
			en: { name: 'Deep Fluids (Kim et al., 2019)', problem: 'Every parameter change needs a new simulation', change: 'Train a network that generates velocity fields from parameters' },
		},
	},
	{
		id: 'pinns', year: 2019, band: 3, slot: 1, label: 'PINNs', from: [],
		text: {
			ja: { name: 'PINNs（Raissi ら、2019）', problem: '観測データが少ないと、データだけでは解が決まらない', change: '支配方程式の残差を自動微分で求めて損失に入れる。観測データと残差を使い、未知の係数を推定する逆問題にも適用した' },
			en: { name: 'PINNs (Raissi et al., 2019)', problem: 'Sparse data alone does not determine the solution', change: 'Add the PDE residual, computed by automatic differentiation, to the loss; also applied to inverse problems estimating unknown coefficients from data' },
		},
	},
	{
		id: 'cconv', year: 2020, band: 1, slot: 2, label: 'Ummenhofer', from: ['spnets'],
		text: {
			ja: { name: '連続畳み込み（Ummenhofer ら、ICLR 2020）', problem: 'SPH のカーネルの形は人が決めた式で固定されている', change: '重みを相対位置の関数として格子上に持ち、補間で評価する畳み込みに置き換える。カーネルの形をデータから決める' },
			en: { name: 'Continuous convolutions (Ummenhofer et al., ICLR 2020)', problem: 'The SPH kernel shape is fixed by hand', change: 'Replace it with a convolution whose weights are a learned function of relative position' },
		},
	},
	{
		id: 'gns', year: 2020, band: 1, slot: 0, label: 'GNS', from: ['dpi'],
		text: {
			ja: { name: 'GNS（Sanchez-Gonzalez ら、ICML 2020）', problem: '予測を次の入力に戻すと誤差が引き継がれ、長いロールアウトで精度が落ちる', change: '半径内の粒子を結んだグラフでメッセージパッシングを多段に重ね、学習時の入力にノイズを加える。1 ステップで学習したモデルを数千ステップ先、一桁多い粒子数まで使えることを示す' },
			en: { name: 'GNS (Sanchez-Gonzalez et al., ICML 2020)', problem: 'Errors carry over when predictions are fed back; long rollouts lose accuracy', change: 'Many message-passing layers on a radius graph, plus input noise during training; one-step training holds for thousands of steps and 10× more particles' },
		},
	},
	{
		id: 'mgn', year: 2021, band: 1, slot: 1, label: 'MeshGraphNets', from: ['gns'],
		text: {
			ja: { name: 'MeshGraphNets（Pfaff ら、ICLR 2021）', problem: '半径グラフでは、布や構造体のように「どの点とどの点がつながっているか」を表せない', change: 'メッシュの辺をそのままグラフにし、空間で近い点どうしの辺を別に足す。FEM の構造解析や CFD の格子の計算を同じ枠組みで学習する' },
			en: { name: 'MeshGraphNets (Pfaff et al., ICLR 2021)', problem: 'A radius graph cannot express mesh connectivity (cloth, structures)', change: 'Use mesh edges as the graph and add separate world-space edges; learns FEM and CFD meshes in one framework' },
		},
	},
	{
		id: 'deeponet', year: 2021, band: 3, slot: 0, label: 'DeepONet', from: ['pinns'],
		text: {
			ja: { name: 'DeepONet（Lu ら、Nature Machine Intelligence 2021）', problem: 'PINNs は一つのネットワークが一つの問題の解しか表さず、条件を変えるたびに学習し直す', change: '入力関数を読む枝のネットワークと、出力の評価点を読む幹のネットワークの積で、条件から解への写像を表す。根拠は Chen と Chen（1995）の演算子近似の定理' },
			en: { name: 'DeepONet (Lu et al., Nature Machine Intelligence 2021)', problem: 'A PINN represents one solution; new conditions mean retraining', change: 'Represent the map from conditions to solutions as a product of a branch net and a trunk net, based on Chen & Chen (1995)' },
		},
	},
	{
		id: 'fno', year: 2021, band: 3, slot: 2, label: 'FNO', from: ['pinns'],
		text: {
			ja: { name: 'FNO（Li ら、ICLR 2021）', problem: 'PINNs は条件を変えるたびに学習し直す', change: '場をフーリエ変換し、低い波数の成分に学習した重みを掛けて戻す層を重ねる。重みが波数に乗るので、学習時と違う解像度の格子でも評価できる' },
			en: { name: 'FNO (Li et al., ICLR 2021)', problem: 'PINNs retrain for every new condition', change: 'Layers that Fourier-transform the field and weight low modes; weights live on wavenumbers, so other resolutions work' },
		},
	},
	{
		id: 'transolver', year: 2024, band: 4, slot: 0, label: 'Transolver', from: ['mgn'],
		text: {
			ja: { name: 'Transolver（Wu ら、ICML 2024）', problem: 'メッセージパッシングは 1 段で 1 ホップしか届かず、全点の注意は計算量が点数の 2 乗になる', change: 'メッシュの点を学習で決めた少数の「スライス」に割り当て、スライスどうしで注意を取る' },
			en: { name: 'Transolver (Wu et al., ICML 2024)', problem: 'Message passing reaches one hop per layer; full attention costs N²', change: 'Assign mesh points to a few learned slices and attend between slices' },
		},
	},
	{
		id: 'worldparticle', year: 2026, band: 4, slot: 2, label: 'WorldParticle', from: ['cconv', 'gns'],
		text: {
			ja: { name: 'WorldParticle（Wang ら、2026、arXiv）', problem: '現象ごとにネットワークの構成を設計している', change: '外力だけを陽的に積分し、粒子間の相互作用による修正をネットワークに出させる。修正は、Ummenhofer らと同じ形のカーネルで近傍を集めた後、全粒子の自己注意とトークンの統合を繰り返して作る。布、弾性体、ニュートン流体と非ニュートン流体、粉体、分子動力学を同じ構成で学習' },
			en: { name: 'WorldParticle (Wang et al., 2026, arXiv)', problem: 'A separately designed architecture for each phenomenon', change: 'Integrate external forces explicitly and predict the interaction correction: a learned-kernel neighborhood encoder (as in Ummenhofer et al.), then repeated full self-attention and token merging; one setup for cloth, elastic, Newtonian and non-Newtonian fluids, granular, and MD' },
		},
	},
];
