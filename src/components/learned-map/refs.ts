// IV-0 の参考文献。番号は年の古い順（同じ年は下の並び順）で、本文・図の引用の印と一覧で共通
// 引用の印は <Cite k="キー" at="§4.2" />。at は参照した節・図・表
export type Ref = {
	key: string;
	year: number;
	authors: string;
	title: string;
	venue: string;
	url?: string;
};

const refs: Ref[] = [
	{ key: 'sirovich1987', year: 1987, authors: 'Sirovich, L.', title: 'Turbulence and the dynamics of coherent structures, Parts I–III', venue: 'Quarterly of Applied Mathematics, 45(3), 561–590' },
	{ key: 'berkooz1993', year: 1993, authors: 'Berkooz, G., Holmes, P., & Lumley, J. L.', title: 'The proper orthogonal decomposition in the analysis of turbulent flows', venue: 'Annual Review of Fluid Mechanics, 25, 539–575' },
	{ key: 'chen1995', year: 1995, authors: 'Chen, T., & Chen, H.', title: 'Universal approximation to nonlinear operators by neural networks with arbitrary activation functions and its application to dynamical systems', venue: 'IEEE Transactions on Neural Networks, 6(4), 911–917' },
	{ key: 'lagaris1998', year: 1998, authors: 'Lagaris, I. E., Likas, A., & Fotiadis, D. I.', title: 'Artificial neural networks for solving ordinary and partial differential equations', venue: 'IEEE Transactions on Neural Networks, 9(5), 987–1000' },
	{ key: 'barbic2005', year: 2005, authors: 'Barbič, J., & James, D. L.', title: 'Real-time subspace integration for St. Venant-Kirchhoff deformable models', venue: 'ACM Transactions on Graphics, 24(3), 982–990' },
	{ key: 'treuille2006', year: 2006, authors: 'Treuille, A., Lewis, A., & Popović, Z.', title: 'Model reduction for real-time fluids', venue: 'ACM Transactions on Graphics, 25(3), 826–834' },
	{ key: 'ladicky2015', year: 2015, authors: 'Ladický, L., Jeong, S., Solenthaler, B., Pollefeys, M., & Gross, M.', title: 'Data-driven fluid simulations using regression forests', venue: 'ACM Transactions on Graphics, 34(6), 1–9 (SIGGRAPH Asia 2015)', url: 'https://doi.org/10.1145/2816795.2818129' },
	{ key: 'battaglia2016', year: 2016, authors: 'Battaglia, P. W., Pascanu, R., Lai, M., Rezende, D. J., & Kavukcuoglu, K.', title: 'Interaction networks for learning about objects, relations and physics', venue: 'Advances in Neural Information Processing Systems (NIPS) 29', url: 'https://arxiv.org/abs/1612.00222' },
	{ key: 'chang2017', year: 2017, authors: 'Chang, M. B., Ullman, T., Torralba, A., & Tenenbaum, J. B.', title: 'A compositional object-based approach to learning physical dynamics', venue: 'International Conference on Learning Representations (ICLR) 2017', url: 'https://arxiv.org/abs/1612.00341' },
	{ key: 'tompson2017', year: 2017, authors: 'Tompson, J., Schlachter, K., Sprechmann, P., & Perlin, K.', title: 'Accelerating Eulerian fluid simulation with convolutional networks', venue: 'International Conference on Machine Learning (ICML) 2017, Proceedings of Machine Learning Research 70, 3424–3433', url: 'https://arxiv.org/abs/1607.03597' },
	{ key: 'vaswani2017', year: 2017, authors: 'Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, L., & Polosukhin, I.', title: 'Attention is all you need', venue: 'Advances in Neural Information Processing Systems (NIPS) 30', url: 'https://arxiv.org/abs/1706.03762' },
	{ key: 'sanchez2018', year: 2018, authors: 'Sanchez-Gonzalez, A., Heess, N., Springenberg, J. T., Merel, J., Riedmiller, M., Hadsell, R., & Battaglia, P.', title: 'Graph networks as learnable physics engines for inference and control', venue: 'International Conference on Machine Learning (ICML) 2018, Proceedings of Machine Learning Research 80, 4470–4479', url: 'https://arxiv.org/abs/1806.01242' },
	{ key: 'schenck2018', year: 2018, authors: 'Schenck, C., & Fox, D.', title: 'SPNets: Differentiable fluid dynamics for deep neural networks', venue: 'Conference on Robot Learning (CoRL) 2018, Proceedings of Machine Learning Research 87, 317–335', url: 'https://arxiv.org/abs/1806.06094' },
	{ key: 'li2019dpi', year: 2019, authors: 'Li, Y., Wu, J., Tedrake, R., Tenenbaum, J. B., & Torralba, A.', title: 'Learning particle dynamics for manipulating rigid bodies, deformable objects, and fluids', venue: 'International Conference on Learning Representations (ICLR) 2019', url: 'https://arxiv.org/abs/1810.01566' },
	{ key: 'kim2019', year: 2019, authors: 'Kim, B., Azevedo, V. C., Thuerey, N., Kim, T., Gross, M., & Solenthaler, B.', title: 'Deep Fluids: A generative network for parameterized fluid simulations', venue: 'Computer Graphics Forum, 38(2), 59–70', url: 'https://arxiv.org/abs/1806.02071' },
	{ key: 'raissi2019', year: 2019, authors: 'Raissi, M., Perdikaris, P., & Karniadakis, G. E.', title: 'Physics-informed neural networks: A deep learning framework for solving forward and inverse problems involving nonlinear partial differential equations', venue: 'Journal of Computational Physics, 378, 686–707（本文の節は arXiv 版 1711.10561 と 1711.10566 による）' },
	{ key: 'greydanus2019', year: 2019, authors: 'Greydanus, S., Dzamba, M., & Yosinski, J.', title: 'Hamiltonian neural networks', venue: 'Advances in Neural Information Processing Systems (NeurIPS) 32', url: 'https://arxiv.org/abs/1906.01563' },
	{ key: 'ummenhofer2020', year: 2020, authors: 'Ummenhofer, B., Prantl, L., Thuerey, N., & Koltun, V.', title: 'Lagrangian fluid simulation with continuous convolutions', venue: 'International Conference on Learning Representations (ICLR) 2020', url: 'https://openreview.net/forum?id=B1lDoJSYDH' },
	{ key: 'sanchez2020', year: 2020, authors: 'Sanchez-Gonzalez, A., Godwin, J., Pfaff, T., Ying, R., Leskovec, J., & Battaglia, P. W.', title: 'Learning to simulate complex physics with graph networks', venue: 'International Conference on Machine Learning (ICML) 2020, Proceedings of Machine Learning Research 119, 8459–8468', url: 'https://arxiv.org/abs/2002.09405' },
	{ key: 'um2020', year: 2020, authors: 'Um, K., Brand, R., Fei, Y., Holl, P., & Thuerey, N.', title: 'Solver-in-the-loop: Learning from differentiable physics to interact with iterative PDE-solvers', venue: 'Advances in Neural Information Processing Systems (NeurIPS) 33', url: 'https://arxiv.org/abs/2007.00016' },
	{ key: 'holl2020', year: 2020, authors: 'Holl, P., Koltun, V., & Thuerey, N.', title: 'Learning to control PDEs with differentiable physics', venue: 'International Conference on Learning Representations (ICLR) 2020', url: 'https://arxiv.org/abs/2001.07457' },
	{ key: 'pfaff2021', year: 2021, authors: 'Pfaff, T., Fortunato, M., Sanchez-Gonzalez, A., & Battaglia, P. W.', title: 'Learning mesh-based simulation with graph networks', venue: 'International Conference on Learning Representations (ICLR) 2021', url: 'https://arxiv.org/abs/2010.03409' },
	{ key: 'li2021fno', year: 2021, authors: 'Li, Z., Kovachki, N., Azizzadenesheli, K., Liu, B., Bhattacharya, K., Stuart, A., & Anandkumar, A.', title: 'Fourier neural operator for parametric partial differential equations', venue: 'International Conference on Learning Representations (ICLR) 2021', url: 'https://arxiv.org/abs/2010.08895' },
	{ key: 'lu2021', year: 2021, authors: 'Lu, L., Jin, P., Pang, G., Zhang, Z., & Karniadakis, G. E.', title: 'Learning nonlinear operators via DeepONet based on the universal approximation theorem of operators', venue: 'Nature Machine Intelligence, 3, 218–229（本文の節は arXiv v3 による）', url: 'https://arxiv.org/abs/1910.03193' },
	{ key: 'krishnapriyan2021', year: 2021, authors: 'Krishnapriyan, A. S., Gholami, A., Zhe, S., Kirby, R. M., & Mahoney, M. W.', title: 'Characterizing possible failure modes in physics-informed neural networks', venue: 'Advances in Neural Information Processing Systems (NeurIPS) 34', url: 'https://arxiv.org/abs/2109.01050' },
	{ key: 'allen2022', year: 2022, authors: 'Allen, K. R., Lopez-Guevara, T., Stachenfeld, K., Sanchez-Gonzalez, A., Battaglia, P., Hamrick, J., & Pfaff, T.', title: 'Physical design using differentiable learned simulators', venue: 'arXiv:2202.00728（プレプリント。参照したのは arXiv v1）', url: 'https://arxiv.org/abs/2202.00728' },
	{ key: 'brandstetter2022', year: 2022, authors: 'Brandstetter, J., Worrall, D. E., & Welling, M.', title: 'Message passing neural PDE solvers', venue: 'International Conference on Learning Representations (ICLR) 2022', url: 'https://arxiv.org/abs/2202.03376' },
	{ key: 'stachenfeld2022', year: 2022, authors: 'Stachenfeld, K., Fielding, D. B., Kochkov, D., Cranmer, M., Pfaff, T., Godwin, J., Cui, C., Ho, S., Battaglia, P., & Sanchez-Gonzalez, A.', title: 'Learned coarse models for efficient turbulence simulation', venue: 'International Conference on Learning Representations (ICLR) 2022', url: 'https://arxiv.org/abs/2112.15275' },
	{ key: 'ma2023', year: 2023, authors: 'Ma, P., Chen, P. Y., Deng, B., Tenenbaum, J. B., Du, T., Gan, C., & Matusik, W.', title: 'Learning neural constitutive laws from motion observations for generalizable PDE dynamics', venue: 'International Conference on Machine Learning (ICML) 2023, Proceedings of Machine Learning Research 202, 23279–23300', url: 'https://arxiv.org/abs/2304.14369' },
	{ key: 'yu2023', year: 2023, authors: 'Yu, H.-X., Zheng, Y., Gao, Y., Deng, Y., Zhu, B., & Wu, J.', title: 'Inferring hybrid neural fluid fields from videos', venue: 'Advances in Neural Information Processing Systems (NeurIPS) 36, 63595–63608', url: 'https://arxiv.org/abs/2312.06561' },
	{ key: 'wu2024', year: 2024, authors: 'Wu, H., Luo, H., Wang, H., Wang, J., & Long, M.', title: 'Transolver: A fast transformer solver for PDEs on general geometries', venue: 'International Conference on Machine Learning (ICML) 2024, Proceedings of Machine Learning Research 235, 53681–53705', url: 'https://arxiv.org/abs/2402.02366' },
	{ key: 'jiang2025', year: 2025, authors: 'Jiang, H., Hsu, H.-Y., Zhang, K., Yu, H.-N., Wang, S., & Li, Y.', title: 'PhysTwin: Physics-informed reconstruction and simulation of deformable objects from videos', venue: 'IEEE/CVF International Conference on Computer Vision (ICCV) 2025, 7219–7230', url: 'https://arxiv.org/abs/2503.17973' },
	{ key: 'zhang2025', year: 2025, authors: 'Zhang, K., Li, B., Hauser, K., & Li, Y.', title: 'Particle-grid neural dynamics for learning deformable object models from RGB-D videos', venue: 'Robotics: Science and Systems (RSS) XXI, 2025', url: 'https://arxiv.org/abs/2506.15680' },
	{ key: 'wang2026', year: 2026, authors: 'Wang, C., Guo, M., Chen, S., et al.', title: 'WorldParticle: Unified world simulation of Lagrangian particle dynamics via transformer', venue: 'arXiv:2605.15305（2026 年 11 月時点で、arXiv のページに掲載先の記載はない）', url: 'https://arxiv.org/abs/2605.15305' },
];

// 第 IV 部 1 章（DMD）だけが引く文献。IV-0 の全件の一覧には入れない
const dmdRefs: Ref[] = [
	{ key: 'koopman1931', year: 1931, authors: 'Koopman, B. O.', title: 'Hamiltonian systems and transformation in Hilbert space', venue: 'Proceedings of the National Academy of Sciences, 17(5), 315–318', url: 'https://doi.org/10.1073/pnas.17.5.315' },
	{ key: 'mezic2005', year: 2005, authors: 'Mezić, I.', title: 'Spectral properties of dynamical systems, model reduction and decompositions', venue: 'Nonlinear Dynamics, 41(1–3), 309–325', url: 'https://doi.org/10.1007/s11071-005-2824-x' },
	{ key: 'rowley2009', year: 2009, authors: 'Rowley, C. W., Mezić, I., Bagheri, S., Schlatter, P., & Henningson, D. S.', title: 'Spectral analysis of nonlinear flows', venue: 'Journal of Fluid Mechanics, 641, 115–127（参照したのは要旨）', url: 'https://doi.org/10.1017/S0022112009992059' },
	{ key: 'schmid2010', year: 2010, authors: 'Schmid, P. J.', title: 'Dynamic mode decomposition of numerical and experimental data', venue: 'Journal of Fluid Mechanics, 656, 5–28（参照したのは要旨）', url: 'https://doi.org/10.1017/S0022112010001217' },
	{ key: 'tu2014', year: 2014, authors: 'Tu, J. H., Rowley, C. W., Luchtenburg, D. M., Brunton, S. L., & Kutz, J. N.', title: 'On dynamic mode decomposition: Theory and applications', venue: 'Journal of Computational Dynamics, 1(2), 391–421（節は arXiv v1 による）', url: 'https://arxiv.org/abs/1312.0041' },
	{ key: 'brunton2016', year: 2016, authors: 'Brunton, S. L., Proctor, J. L., & Kutz, J. N.', title: 'Discovering governing equations from data by sparse identification of nonlinear dynamical systems', venue: 'Proceedings of the National Academy of Sciences, 113(15), 3932–3937（節は arXiv v1 による）', url: 'https://arxiv.org/abs/1509.03580' },
	{ key: 'taira2017', year: 2017, authors: 'Taira, K., Brunton, S. L., Dawson, S. T. M., Rowley, C. W., Colonius, T., McKeon, B. J., Schmidt, O. T., Gordeyev, S., Theofilis, V., & Ukeiley, L. S.', title: 'Modal analysis of fluid flows: An overview', venue: 'AIAA Journal, 55(12), 4013–4041（節は arXiv 版による）', url: 'https://arxiv.org/abs/1702.01453' },
];

const byYear = (list: Ref[]): Ref[] =>
	list
		.map((r, i) => ({ r, i }))
		.sort((a, b) => a.r.year - b.r.year || a.i - b.i)
		.map(({ r }) => r);

// 年の古い順（同じ年は上の並び順のまま）
export const sorted: Ref[] = refs
	.map((r, i) => ({ r, i }))
	.sort((a, b) => a.r.year - b.r.year || a.i - b.i)
	.map(({ r }) => r);
const sortedAll = byYear([...refs, ...dmdRefs]);

// ページごとの参考文献（番号はそのページの中で年の古い順に振り直す）。載っていないページ（IV-0）は全件
export const pageRefs: Record<string, string[]> = {
	'learned/01-dmd': ['sirovich1987', 'koopman1931', 'mezic2005', 'rowley2009', 'schmid2010', 'tu2014', 'sanchez2020', 'brunton2016', 'taira2017'],
	'learned/07-taxonomy': ['tompson2017', 'raissi2019', 'sanchez2020', 'pfaff2021', 'li2021fno', 'lu2021', 'brandstetter2022', 'wu2024'],
};
export const listFor = (page?: string): Ref[] => {
	const keys = page ? pageRefs[page] : undefined;
	return keys ? sortedAll.filter((r) => keys.includes(r.key)) : sorted;
};

export const numberOf = (key: string, page?: string): number => {
	const i = listFor(page).findIndex((r) => r.key === key);
	if (i < 0) throw new Error(`参考文献のキーが無い: ${key}（${page ?? 'IV-0'}）`);
	return i + 1;
};

export type CiteRef = { k: string; at?: string };
