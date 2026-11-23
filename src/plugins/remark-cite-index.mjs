// MDX の <Cite k="..." /> に、同じ文献の何回目の引用かを i として振る。
// <Refs /> には、文献ごとの引用の回数を uses（JSON）として渡し、参考文献から本文へ戻るリンクを作らせる
function attr(node, name) {
	return node.attributes?.find((a) => a.type === 'mdxJsxAttribute' && a.name === name);
}

function walk(node, fn) {
	fn(node);
	for (const c of node.children ?? []) walk(c, fn);
}

export default function remarkCiteIndex() {
	return (tree) => {
		const counts = {};
		const refsNodes = [];
		walk(tree, (node) => {
			if (node.type !== 'mdxJsxFlowElement' && node.type !== 'mdxJsxTextElement') return;
			if (node.name === 'Cite') {
				const k = attr(node, 'k')?.value;
				if (typeof k !== 'string') throw new Error('<Cite> の k は文字列で書く');
				counts[k] = (counts[k] ?? 0) + 1;
				node.attributes.push({ type: 'mdxJsxAttribute', name: 'i', value: String(counts[k]) });
			} else if (node.name === 'Refs') {
				refsNodes.push(node);
			}
		});
		for (const n of refsNodes) {
			n.attributes.push({ type: 'mdxJsxAttribute', name: 'uses', value: JSON.stringify(counts) });
		}
	};
}
