// 図の中身（図の説明とは別に、年表の欄や分類のマスで）引用している文献。参考文献から図へ戻るリンクに使う
import { items } from './timeline-data';
import { schoolCells } from './strings';
import { taxonomyCites } from '../learned-taxonomy/table-data';

const uniq = (a: string[]) => [...new Set(a)];

const overview: Record<string, string[]> = {
	'fig-3': uniq(items.flatMap((it) => [it.paper, ...it.problemCites.map((c) => c.k), ...it.changeCites.map((c) => c.k)])),
	'fig-6': uniq(schoolCells.flatMap((c) => c[4].map((x) => x.k))),
};

// ページごとの図の中の引用。載っていないページ（IV-0）は overview
const byPage: Record<string, Record<string, string[]>> = {
	'learned/01-taxonomy': { 'fig-6': uniq(taxonomyCites()) },
};
export const figureCitesFor = (page?: string) => (page && byPage[page]) || overview;
