import { e as createComponent, k as renderHead, l as renderScript, r as renderTemplate } from '../../chunks/astro/server_zv5rRqsz.mjs';
import 'clsx';
/* empty css                                      */
export { renderers } from '../../renderers.mjs';

const $$Correct = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en" data-astro-cid-c73mnmfq> <head><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Correct Results - PhotoClean</title>${renderHead()}</head> <body data-astro-cid-c73mnmfq> <div class="container" data-astro-cid-c73mnmfq> <header data-astro-cid-c73mnmfq> <a href="/" class="back-link" data-astro-cid-c73mnmfq>← Back to Swiper</a> <h1 data-astro-cid-c73mnmfq>Correct Images</h1> <p class="subtitle" data-astro-cid-c73mnmfq>Images marked as correct</p> <div class="nav-links" data-astro-cid-c73mnmfq> <a href="/results/incorrect" class="nav-link" data-astro-cid-c73mnmfq>View Incorrect →</a> </div> </header> <div class="results-grid" id="results-grid" data-astro-cid-c73mnmfq> <div class="loading" data-astro-cid-c73mnmfq>Loading...</div> </div> <div class="empty-message" id="empty-message" style="display: none;" data-astro-cid-c73mnmfq> <p data-astro-cid-c73mnmfq>No correct images yet.</p> <a href="/" class="btn-primary" data-astro-cid-c73mnmfq>Start Swiping</a> </div> </div>  ${renderScript($$result, "D:/work/photoclean/src/pages/results/correct.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "D:/work/photoclean/src/pages/results/correct.astro", void 0);

const $$file = "D:/work/photoclean/src/pages/results/correct.astro";
const $$url = "/results/correct";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Correct,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
