// DMD の章の図で使う文字（日本語。英語版は書くときにここへ足す）
export type Lang = 'ja';

export const ui = {
	ja: {
		play: '再生',
		pause: '停止',
		step: 'ステップ',
		pairs: '使う組の数 m',
		rank: '打ち切りランク r',
		solver: '陽解法（正解）',
		dmdFull: 'DMD（r = 16）',
		dmdRank: 'DMD（r = 6）',
		errorRms: '誤差（RMS）',
		snapshots: 'スナップショット',
		timeAxis: '時刻のステップ n',
		eigA: '陽解法の行列 A の固有値',
		eigCont: '連続の解析解の減衰率',
		eigDmd: 'DMD の固有値',
		re: '実部',
		im: '虚部',
		index: 'モード番号 k',
		sv: 'X の特異値',
		kept: '残す',
		dropped: '捨てる',
		mode: '動的モード',
		sine: '正弦波',
	},
};
