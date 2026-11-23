// 図の中身（図の説明とは別に、年表の欄や分類のマスで）引用している文献。参考文献から図へ戻るリンクに使う
import { items } from './timeline-data';
import { schoolCells } from './strings';

const uniq = (a: string[]) => [...new Set(a)];

export const figureCites: Record<string, string[]> = {
	'fig-3': uniq(items.flatMap((it) => [it.paper, ...it.problemCites.map((c) => c.k), ...it.changeCites.map((c) => c.k)])),
	'fig-6': uniq(schoolCells.flatMap((c) => c[4].map((x) => x.k))),
};
