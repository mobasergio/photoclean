import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DRqKDbPq.mjs';
import { manifest } from './manifest_1azQw7X2.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/next-image.astro.mjs');
const _page2 = () => import('./pages/api/results/correct.astro.mjs');
const _page3 = () => import('./pages/api/results/incorrect.astro.mjs');
const _page4 = () => import('./pages/api/results/update.astro.mjs');
const _page5 = () => import('./pages/api/results/upload.astro.mjs');
const _page6 = () => import('./pages/api/stats.astro.mjs');
const _page7 = () => import('./pages/api/swipe.astro.mjs');
const _page8 = () => import('./pages/api/undo.astro.mjs');
const _page9 = () => import('./pages/results/correct.astro.mjs');
const _page10 = () => import('./pages/results/incorrect.astro.mjs');
const _page11 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/next-image.ts", _page1],
    ["src/pages/api/results/correct.ts", _page2],
    ["src/pages/api/results/incorrect.ts", _page3],
    ["src/pages/api/results/update.ts", _page4],
    ["src/pages/api/results/upload.ts", _page5],
    ["src/pages/api/stats.ts", _page6],
    ["src/pages/api/swipe.ts", _page7],
    ["src/pages/api/undo.ts", _page8],
    ["src/pages/results/correct.astro", _page9],
    ["src/pages/results/incorrect.astro", _page10],
    ["src/pages/index.astro", _page11]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "37592692-5b15-4f08-8770-a23f9cd63bae",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
