---
title: 学習型のシミュレーターの地図
description: シミュレーターをデータから学習させる研究が、縮約モデルから粒子のグラフ、ニューラル演算子、PINNs、Transformer へとどう移ってきたかをたどり、流派を入出力と物理の入れ方で整理する。
---

数値シミュレーションのソルバーは、偏微分方程式を空間と時間について離散化し、時刻 $t$ の状態から時刻 $t+\Delta t$ の状態を求める写像を繰り返し適用して、時間発展を計算する。
この時間発展の写像をニューラルネットワークで近似する研究は、2016 年の Interaction Networks を起点の一つとし、対象を粒子系、メッシュ、格子へと広げてきた。
この 0 章は地図にあたる。
個々の手法の中身より先に、どの研究が前の研究の何に困って何を変えたのかという流れと、流派を分ける軸を置いておく。

## なぜシミュレーターを学習させるのか

動機は少なくとも四つあり、どれを重く見るかで選ぶ手法が変わる。

一つ目は**速さ**である。
学習したモデルは、1 ステップを数回の行列演算で進められる。
圧力のポアソン方程式のような大きな線形系を毎ステップ解かずに済めば、従来のソルバーより大きな時間刻みを取れ、計算時間を短縮できる場合がある。
ただし、学習用のデータは従来のソルバーで作る。
そのため速さが得になるのは、同じ種類の計算を何度も回す場面（設計の探索、対話的な操作）に限られる。

二つ目は**微分できること**である。
ネットワークは自動微分で入力に対する勾配が取れる。
数百ステップ先の結果を初期条件や物性値で微分できれば、勾配法で設計変数を動かせる。
従来のソルバーでも随伴法で同じことはできるが、ソルバーごとに随伴の実装が要る。

三つ目は、**式が分からない現象**を扱えることである。
粉体や非ニュートン流体のように構成則がはっきりしない材料では、式を書く代わりに、実験や観測のデータから振る舞いを学ばせる道がある。

四つ目は**逆問題と制御**である。
観測から物性値や境界条件を推定する問題と、目標の状態へ導く操作を探す問題は、上の二つ（速さと微分）が揃うと扱いやすくなる。
順方向の計算を何千回も回し、その勾配を使うからだ。

一方で、学習型のシミュレーターは保存則や安定性を自動的には守らない。
後で見る歴史の転換点の多くは、この代償から生まれている。

## 歴史：前の手法の何に困って、何を変えたか

ここに年表の図。横軸に 1990 年から 2026 年、縦に四本の帯（縮約モデル、グラフと粒子、関数の写像、Transformer）を並べ、各手法を点で置き、「困りごと → 変更」の矢印でつなぐ。

### 縮約モデルという出発点

学習型の前史には、**縮約モデル**（reduced-order model）がある。
乱流の研究では、流れ場のスナップショットを集めて主成分に分解する **POD**（固有直交分解）が、組織構造を少数のモードで表す道具として使われてきた[^pod]。
少数のモードの係数だけを時間発展させれば、自由度が桁違いに減る。

コンピューターグラフィックスでも、この発想で実時間の計算が実現した。
Barbič と James（2005）は変形体の運動を部分空間に射影して積分し、Treuille ら（2006）は流体のスナップショットから基底を作って実時間の煙を動かした。

困ったのは、基底が特定の形状と条件に結びついていることだった。
容器の形や物体の配置を変えると、スナップショットを取り直して基底を作り直す必要がある。
WorldParticle の序論も、縮約法の弱点としてこの点を挙げている。

### 物体の相互作用をグラフで学ぶ

2016 年の **Interaction Networks**（Battaglia ら）は、物理系を「物体」と「物体間の関係」のグラフで表し、関係ごとの作用と物体ごとの更新をそれぞれネットワークで学ばせた。
同じ時期の Neural Physics Engine（Chang ら、ICLR 2017）も、物体の組から相互作用を学ぶ構成をとっている。

この形の利点は、学習するのが「二つの物体のあいだで何が起きるか」という局所の規則である点だった。
規則は物体の数に依存しないので、学習時より多い物体にもそのまま当てはめられる。
従来のソルバーも、格子点や粒子の数によらず、同じ局所の離散化の式をどの点にも当てはめる。

ただし、どの物体とどの物体が関係を持つかは、人が与える前提だった。
流体のように相手が刻々と入れ替わる系には、そのままでは使えない。

### 粒子の近傍をグラフにする

次の数年で、グラフの頂点を物体から粒子に置き換える研究が並んだ。
関係を人が与える代わりに、粒子の距離からその都度近傍を作れば、流体にも使える。

その前段として、SPH の粒子ごとの特徴量から加速度を回帰森で予測した Ladický ら（2015）がある。
SPNets（Schenck と Fox、2018）は、SPH の計算そのものを微分可能な層として書き、ネットワークの中に組み込んだ。
DPI-Net（Li ら、ICLR 2019）は、剛体、変形体、流体の粒子を一つのグラフで扱い、ロボットの操作の計画に使った。

2020 年には二つの方向が出た。
Ummenhofer ら（ICLR 2020）は、SPH のカーネルを学習可能な**連続畳み込み**に置き換えた。
重みを相対位置の関数として格子上に持ち、補間で評価する作りで、カーネルの形そのものをデータから決める。
GNS（Sanchez-Gonzalez ら、ICML 2020）は、半径内の粒子を辺で結んだグラフ上で、メッセージパッシングを何段も重ねた。
流体、剛体、変形体が互いに作用する場面を同じ構成で学習し、1 ステップの予測で学習したモデルが、数千ステップ先や一桁多い粒子数まで使えることを示した。
長いロールアウトの精度を左右した要因として、論文はメッセージパッシングの段数と、学習データにノイズを加えて誤差の積み重なりを抑える工夫を挙げている。
ノイズは、推論時に自分の誤差を含んだ入力を受け取ることへの備えになる。

これらの手法の 1 ステップは、近傍で辺を作り、辺ごとに相手の情報を集め、粒子ごとに状態を更新する。
近傍との相互作用を足し合わせて状態を進める点は、従来の離散化と同じ構造である。
違うのは、集め方と更新の規則を学習で決める点だ。

### メッシュへ広げる

粒子の半径グラフは、布や構造体のように「どの点とどの点がつながっているか」が意味を持つ対象には向かない。
離れていても同じ布の隣り合う点は強く結びつき、近くても別の布の点は結びつかないからだ。

MeshGraphNets（Pfaff ら、ICLR 2021）は、シミュレーションのメッシュの辺をそのままグラフにした。
布の自己接触のように、メッシュの上では遠いが空間では近い点どうしには、空間の距離で張る辺を別に足す。
これで、FEM の構造解析や CFD の格子の計算を、GNS と同じ枠組みで学習できるようになった。
シミュレーション中にメッシュの細かさを変える操作も、学習の対象に含めている。

### 方程式を損失に入れる

ここまでの手法は、正解の軌跡を大量に必要とする。
データを作るのに従来のソルバーを何百回も回すなら、そのコストは無視できない。

**PINNs**（physics-informed neural networks、Raissi ら、2019）は、別の向きから問題を立てた。
ネットワークを時空間の座標から解の値を返す関数とし、支配方程式の残差を自動微分で計算して損失に入れる。
観測データが少なくても、方程式の残差が解の形を制約する。
未知の係数を一緒に学習させれば、逆問題もそのまま解ける。
ネットワークで微分方程式の解を表す考え自体は、Lagaris ら（1998）にさかのぼる。

困ったのは、一つのネットワークが一つの問題の解しか表さないことだった。
境界条件や初期条件を変えるたびに学習し直すので、速さを目的とする用途には向かない。
損失の中で方程式の項と境界条件の項の釣り合いが取りにくく、学習が安定しない例も多い。

### 関数から関数への写像を学ぶ

**ニューラル演算子**は、個々の解ではなく、条件から解への写像そのものを学ぶ。
入力は初期場や係数場という関数で、出力も関数である。
一度学習すれば、新しい初期条件に対して学習し直さずに解を出せる。

DeepONet（Lu ら、Nature Machine Intelligence 2021）は、入力関数を読む枝のネットワークと、出力の評価点を読む幹のネットワークの積で写像を表した。
根拠は、ニューラルネットワークで非線形の演算子を近似できるという Chen と Chen（1995）の定理である。
FNO（Fourier Neural Operator、Li ら、ICLR 2021）は、場をフーリエ変換し、低い波数の成分に学習した重みを掛けて戻す層を重ねた。
重みが格子点ではなく波数に乗るので、学習時と違う解像度の格子でも評価できる。

FNO が最も得意とする入力は格子の場である。
逆に、FFT が前提とする規則格子から外れた形状や、粒子の位置そのものが状態になるラグランジュ的な系には、そのままでは使いにくい。
格子のまま時間発展を学習する研究には、ほかに Tompson ら（ICML 2017）と Deep Fluids（Kim ら、2019）がある。
前者はオイラー流体の圧力投影の線形ソルバーを CNN で置き換え、後者はパラメーターから速度場を生成する。

### 遠くまで届く通信と大規模化

GNS や MeshGraphNets のメッセージパッシングでは、情報が 1 段で 1 ホップしか進まない。
圧力波や弾性体の応力のように、領域の端から端まで瞬時に効く作用を伝えるには、段数を増やすしかない。
段数を増やせば計算が重くなり、学習も難しくなる。

Transformer の注意機構は、すべての点が互いを直接参照できる。
代わりに点の数 N に対して N² の計算量がかかるので、粒子やメッシュの数万点にそのまま使うと重すぎる。
2024 年以降の研究は、この N² を避ける工夫を競っている。
Transolver（Wu ら、ICML 2024）は、メッシュの点を学習で決めた少数の「スライス」に割り当て、スライスどうしで注意を取る。

粒子系でこの問題に取り組んだ例に、WorldParticle（Wang ら、2026、arXiv 2605.15305）がある。
外力だけを陽的に積分して仮の状態を作り、粒子間の相互作用による修正量をネットワークに出させる。
従来のソルバーでもよく使われる、予測と修正に分けて時間を進める形である。
修正の中身は、Ummenhofer らの連続畳み込みで近傍を集める局所の層と、粒子を段階的に束ねた少数の「スーパートークン」の上で注意を取る大域の層の組み合わせになっている。
同じ構成で、布、弾性体、ニュートン流体と非ニュートン流体、粉体、分子動力学を学習させたと報告している。
この流れの先には、現象ごとにソルバーを作り分けず、一つのモデルで多くの物理を扱おうとする「基盤モデル」の構想がある。

### 年表

| 年 | 手法 | 前の何に困っていたか | 何を変えたか |
|---|---|---|---|
| 1987, 1993 | POD による縮約（Sirovich、Berkooz ら） | 自由度が大きすぎる | 少数のモードの係数だけを進める |
| 1998 | Lagaris らのニューラル網による PDE 解法 | （PINNs の前身） | 解をネットワークで表し、方程式で学習させる |
| 2005, 2006 | 部分空間の積分（Barbič と James）、流体の縮約（Treuille ら） | 実時間で回らない | 形状ごとの基底で実時間化 |
| 2015 | 回帰森による SPH（Ladický ら） | SPH が重い | 粒子ごとの特徴量から加速度を回帰 |
| 2016 | Interaction Networks（Battaglia ら） | 物体数が変わると使えない | 関係ごとの局所規則を学ぶ |
| 2017 | CNN による圧力投影（Tompson ら） | ポアソン方程式の求解が重い | 線形ソルバーを CNN で置き換え |
| 2018–2019 | SPNets、DPI-Net | 関係を人が与える前提 | 粒子の近傍からグラフを作る |
| 2019 | PINNs（Raissi ら） | 正解データが大量に要る | 方程式の残差を損失に入れる |
| 2020 | 連続畳み込み（Ummenhofer ら）、GNS（Sanchez-Gonzalez ら） | 長いロールアウトが崩れる、カーネルが固定 | カーネルの学習、多段のメッセージパッシングと入力ノイズ |
| 2021 | MeshGraphNets（Pfaff ら） | 半径グラフでは接続が表せない | メッシュの辺と空間の辺を併用 |
| 2021 | DeepONet、FNO | PINNs は問題ごとに学習し直し | 条件から解への写像を学ぶ |
| 2024 | Transolver（Wu ら） | メッセージパッシングは遠くへ届かない、注意は N² | 少数のスライスで注意を取る |
| 2026 | WorldParticle（Wang ら） | 現象ごとにモデルを作り分ける | 予測と修正の枠に局所の畳み込みと大域の注意を組み合わせる |

年は会議や誌に載った年で、arXiv の初出はこれより早いものが多い[^year]。

## 流派の見取り図

手法を分ける軸を二つ立てる。
一つは何を入力にして何を出すか、もう一つは物理の知識をどこに入れるかである。

入出力の軸では、状態をどう表すかで四つに分かれる。
粒子の位置と速度の集合（GNS、DPI-Net、連続畳み込み、WorldParticle）、メッシュの頂点と辺（MeshGraphNets、Transolver）、規則格子の場（Tompson ら、Deep Fluids、FNO）、そして座標を受けて値を返す関数（PINNs、DeepONet の出力側）である。
最初の三つは「今の状態から次の状態へ」の 1 ステップを学び、それを繰り返して時間を進める。
PINNs は時刻も入力の一つなので、ステップを繰り返さない。
FNO は 1 ステップの写像としても、ある区間の解全体の写像としても使われる。

物理を入れる場所の軸では、三つに分かれる。
**構造に入れる**手法は、ネットワークの形に物理の性質を写す。
近傍の相対位置だけを使えば並進に対して不変になり、外力を陽的に積分してから修正だけを学べば、学習していない外力にも対応しやすい。
**損失に入れる**手法は、方程式の残差や保存量のずれを罰則にする。
PINNs が典型で、WorldParticle も流体で発散を抑える損失を足している。
**入れない**手法は、正解の軌跡との差だけで学ぶ。
GNS の基本形はこれに近いが、相対位置の入力など構造の工夫は含んでいる。
実際の手法の多くは、三つを混ぜている。

ここに見取り図の表か図。行に入出力の 4 種（粒子、メッシュ、格子、関数）、列に物理の入れ方の 3 種（構造、損失、入れない）を取り、各手法を主な位置に置く。複数のマスにまたがる手法は帯で示す。

| | 構造に入れる | 損失に入れる | ほぼ入れない |
|---|---|---|---|
| 粒子 | 連続畳み込み、WorldParticle（予測と修正） | WorldParticle（流体の発散） | GNS の基本形 |
| メッシュ | MeshGraphNets（メッシュの辺） | | Transolver |
| 格子 | Tompson ら（圧力投影の置き換え）、FNO（波数空間） | | Deep Fluids |
| 関数 | DeepONet（演算子近似の定理） | PINNs | |

この表の置き方は、各手法の主な特徴で決めたもので、一つの手法が一つのマスに収まるわけではない。

## この先の章とのつながり

第 IV 部の各章は、この地図の一区画ずつを受け持つ。
入出力の決め方と、1 ステップ予測を繰り返す形の利点と弱点、データの作り方は、1 章「問題の立て方」で扱う。
GNS と MeshGraphNets は 2 章「グラフで学習」、FNO と DeepONet は 3 章「ニューラル演算子」、PINNs は 4 章、WorldParticle などは 5 章「Transformer 系」で扱う。
誤差の積み重なり、学習時と違う条件への汎化、保存則の扱いは、どの流派にも共通する難しさなので、6 章にまとめる。

予測と修正に分けて時間を進める形は、第 I 部の時間積分で扱う。
連続畳み込みが学習に置き換えた重み関数は、第 II 部の SPH のカーネルにある。

## 参考文献

- Sirovich, L. (1987). Turbulence and the dynamics of coherent structures, Parts I–III. *Quarterly of Applied Mathematics*, 45(3), 561–590.
- Berkooz, G., Holmes, P., & Lumley, J. L. (1993). The proper orthogonal decomposition in the analysis of turbulent flows. *Annual Review of Fluid Mechanics*, 25, 539–575.
- Chen, T., & Chen, H. (1995). Universal approximation to nonlinear operators by neural networks with arbitrary activation functions and its application to dynamical systems. *IEEE Transactions on Neural Networks*, 6(4), 911–917.
- Lagaris, I. E., Likas, A., & Fotiadis, D. I. (1998). Artificial neural networks for solving ordinary and partial differential equations. *IEEE Transactions on Neural Networks*, 9(5), 987–1000.
- Barbič, J., & James, D. L. (2005). Real-time subspace integration for St. Venant-Kirchhoff deformable models. *ACM Transactions on Graphics*, 24(3), 982–990.
- Treuille, A., Lewis, A., & Popović, Z. (2006). Model reduction for real-time fluids. *ACM Transactions on Graphics*, 25(3), 826–834.
- Ladický, L., Jeong, S., Solenthaler, B., Pollefeys, M., & Gross, M. (2015). Data-driven fluid simulations using regression forests. *ACM Transactions on Graphics*, 34(6).
- Battaglia, P. W., Pascanu, R., Lai, M., Rezende, D. J., & Kavukcuoglu, K. (2016). Interaction networks for learning about objects, relations and physics. *NIPS 2016*. arXiv:1612.00222.
- Chang, M. B., Ullman, T., Torralba, A., & Tenenbaum, J. B. (2017). A compositional object-based approach to learning physical dynamics. *ICLR 2017*. arXiv:1612.00341.
- Tompson, J., Schlachter, K., Sprechmann, P., & Perlin, K. (2017). Accelerating Eulerian fluid simulation with convolutional networks. *ICML 2017*, PMLR 70, 3424–3433. arXiv:1607.03597.
- Schenck, C., & Fox, D. (2018). SPNets: Differentiable fluid dynamics for deep neural networks. *CoRL 2018*, PMLR 87, 317–335. arXiv:1806.06094.
- Li, Y., Wu, J., Tedrake, R., Tenenbaum, J. B., & Torralba, A. (2019). Learning particle dynamics for manipulating rigid bodies, deformable objects, and fluids. *ICLR 2019*. arXiv:1810.01566.
- Kim, B., Azevedo, V. C., Thuerey, N., Kim, T., Gross, M., & Solenthaler, B. (2019). Deep Fluids: A generative network for parameterized fluid simulations. *Computer Graphics Forum*, 38(2), 59–70. arXiv:1806.02071.
- Raissi, M., Perdikaris, P., & Karniadakis, G. E. (2019). Physics-informed neural networks: A deep learning framework for solving forward and inverse problems involving nonlinear partial differential equations. *Journal of Computational Physics*, 378, 686–707.
- Ummenhofer, B., Prantl, L., Thuerey, N., & Koltun, V. (2020). Lagrangian fluid simulation with continuous convolutions. *ICLR 2020*.
- Sanchez-Gonzalez, A., Godwin, J., Pfaff, T., Ying, R., Leskovec, J., & Battaglia, P. W. (2020). Learning to simulate complex physics with graph networks. *ICML 2020*, PMLR 119, 8459–8468. arXiv:2002.09405.
- Pfaff, T., Fortunato, M., Sanchez-Gonzalez, A., & Battaglia, P. W. (2021). Learning mesh-based simulation with graph networks. *ICLR 2021*. arXiv:2010.03409.
- Li, Z., et al. (2021). Fourier neural operator for parametric partial differential equations. *ICLR 2021*. arXiv:2010.08895.
- Lu, L., Jin, P., Pang, G., Zhang, Z., & Karniadakis, G. E. (2021). Learning nonlinear operators via DeepONet based on the universal approximation theorem of operators. *Nature Machine Intelligence*, 3, 218–229. arXiv:1910.03193.
- Wu, H., Luo, H., Wang, H., Wang, J., & Long, M. (2024). Transolver: A fast transformer solver for PDEs on general geometries. *ICML 2024*, PMLR 235, 53681–53705. arXiv:2402.02366.
- Wang, C., Guo, M., Chen, S., et al. (2026). WorldParticle: Unified world simulation of Lagrangian particle dynamics via transformer. arXiv:2605.15305（2026 年 11 月時点で、arXiv のページに掲載先の記載はない）.

このページの内容は個人の見解です。

[^pod]: POD は分野によって主成分分析、カルーネン・レーベ展開とも呼ばれる。流体で多数のスナップショットから効率よく基底を求める方法は、Sirovich（1987）のスナップショット法として知られる。

[^year]: たとえば DeepONet は 2019 年 10 月に arXiv に出ており、雑誌掲載の 2021 年より PINNs（2019 年の雑誌掲載）との差は小さい。Tompson らも 2016 年 7 月に arXiv に出ている。
