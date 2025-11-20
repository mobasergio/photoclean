import { e as createComponent, k as renderHead, l as renderScript, r as renderTemplate } from '../../chunks/astro/server_zv5rRqsz.mjs';
import 'clsx';
/* empty css                                        */
export { renderers } from '../../renderers.mjs';

const $$Incorrect = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en" data-astro-cid-7d4loep4> <head><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Incorrect Results - PhotoClean</title>${renderHead()}</head> <body data-astro-cid-7d4loep4> <div class="container" data-astro-cid-7d4loep4> <header data-astro-cid-7d4loep4> <a href="/" class="back-link" data-astro-cid-7d4loep4>← Back to Swiper</a> <h1 data-astro-cid-7d4loep4>Incorrect Images</h1> <p class="subtitle" data-astro-cid-7d4loep4>Images marked as incorrect</p> <div class="nav-links" data-astro-cid-7d4loep4> <a href="/results/correct" class="nav-link" data-astro-cid-7d4loep4>View Correct →</a> </div> </header> <div class="results-grid" id="results-grid" data-astro-cid-7d4loep4> <div class="loading" data-astro-cid-7d4loep4>Loading...</div> </div> <div class="empty-message" id="empty-message" style="display: none;" data-astro-cid-7d4loep4> <p data-astro-cid-7d4loep4>No incorrect images yet.</p> <a href="/" class="btn-primary" data-astro-cid-7d4loep4>Start Swiping</a> </div> </div>  ${renderScript($$result, "D:/work/photoclean/src/pages/results/incorrect.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "D:/work/photoclean/src/pages/results/incorrect.astro", void 0);

const $$file = "D:/work/photoclean/src/pages/results/incorrect.astro";
const $$url = "/results/incorrect";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Incorrect,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
