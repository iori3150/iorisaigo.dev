// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeJaText from './src/plugins/rehype-ja-text.mjs';
import remarkCiteIndex from './src/plugins/remark-cite-index.mjs';

// ヘッダーに出すサイト名。決まったらここだけ変える
const SITE_TITLE = 'Notes';

// トップページはまだ無いので、ノートの最初のページへ送る
const FIRST_NOTE = 'learned/00-overview/';

export default defineConfig({
	site: 'https://iorisaigo.dev',
	redirects: {
		'/': `/ja/${FIRST_NOTE}`,
		'/ja/': `/ja/${FIRST_NOTE}`,
		'/en/': `/en/${FIRST_NOTE}`,
		// 旧 URL（章名を「地図」にしていたとき）
		'/ja/learned/00-map/': '/ja/learned/00-overview/',
		'/en/learned/00-map/': '/en/learned/00-overview/',
	},
	markdown: {
		remarkPlugins: [remarkMath, remarkCiteIndex],
		rehypePlugins: [rehypeKatex, rehypeJaText],
	},
	integrations: [
		starlight({
			title: SITE_TITLE,
			logo: { src: './src/assets/logo.svg' },
			favicon: '/favicon.svg',
			defaultLocale: 'ja',
			locales: {
				ja: { label: '日本語', lang: 'ja' },
				en: { label: 'English', lang: 'en' },
			},
			// 書いた章だけを並べる。章を足したらここにも足す
			sidebar: [
				{
					label: '第 IV 部　学習型のシミュレーター',
					translations: { en: 'Part IV  Learned simulators' },
					items: [
						{ label: '0　概観', translations: { en: '0  Overview' }, slug: 'learned/00-overview' },
						{ label: '1　学習型シミュレーターの分類', translations: { en: '1  A taxonomy of learned simulators' }, slug: 'learned/01-taxonomy' },
					],
				},
			],
			pagination: false,
			credits: false,
			head: [
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true } },
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+JP:wght@400;500;600&display=swap',
					},
				},
			],
			customCss: ['katex/dist/katex.min.css', './src/styles/theme.css'],
			components: {
				Footer: './src/components/Footer.astro',
				ThemeProvider: './src/components/ThemeProvider.astro',
				ThemeSelect: './src/components/ThemeSelect.astro',
			},
		}),
		// 英語のページは書くまで日本語の写しなので、サイトマップに入れない
		sitemap({ filter: (page) => !page.includes('/en/') }),
	],
});
