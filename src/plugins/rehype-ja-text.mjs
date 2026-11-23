// 原稿は一文一行で書く。日本語の文の間の改行がそのまま空白に見えないよう、
// 日本語の文字か全角の約物に接する改行を消す。脚注の見出しもページの言語に合わせる
const CJK = '[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー々〆\u3000-\u303f\uff00-\uffef]';
const joinCjk = new RegExp(`(?<=${CJK})[ \t]*\r?\n[ \t]*|[ \t]*\r?\n[ \t]*(?=${CJK})`, 'gu');
const SKIP = new Set(['pre', 'code', 'script', 'style']);

function isMath(node) {
	const cls = node.properties?.className;
	return Array.isArray(cls) && cls.some((c) => String(c).startsWith('katex'));
}

function walk(node) {
	if (!node.children) return;
	// 兄弟の要素をまたぐ改行（**太字**の直後など）も見るため、テキストの前後の文字を並べて調べる
	const kids = node.children;
	for (let i = 0; i < kids.length; i++) {
		const child = kids[i];
		if (child.type === 'text') {
			const before = lastChar(kids[i - 1]);
			const after = firstChar(kids[i + 1]);
			child.value = (before + child.value + after).replace(joinCjk, '').slice(before.length, after.length ? -after.length : undefined);
		} else if (child.type === 'element' && !SKIP.has(child.tagName) && !isMath(child)) {
			walk(child);
		}
	}
}

function textOf(node) {
	if (!node) return '';
	if (node.type === 'text') return node.value;
	if (node.type === 'element' && !isMath(node)) return (node.children ?? []).map(textOf).join('');
	return '';
}
const lastChar = (n) => [...textOf(n)].slice(-1).join('');
const firstChar = (n) => [...textOf(n)].slice(0, 1).join('');

export default function rehypeJaText() {
	return (tree, file) => {
		walk(tree);
		const isEn = /[\/]en[\/]/.test(file.path ?? '');
		const label = isEn ? 'Footnotes' : '脚注';
		(function find(n) {
			if (n.type === 'element' && n.properties?.id === 'footnote-label') n.children = [{ type: 'text', value: label }];
			n.children?.forEach(find);
		})(tree);
	};
}
