import { e as createComponent, f as createAstro, h as addAttribute, k as renderHead, l as renderScript, r as renderTemplate } from '../chunks/astro/server_zv5rRqsz.mjs';
import 'clsx';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`<html lang="en" data-astro-cid-j7pv25f6> <head><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>PhotoClean - Image Validator</title>${renderHead()}</head> <body data-astro-cid-j7pv25f6> <div class="container" data-astro-cid-j7pv25f6> <header data-astro-cid-j7pv25f6> <h1 data-astro-cid-j7pv25f6>PhotoClean</h1> <p class="subtitle" data-astro-cid-j7pv25f6>
Swipe right if correct, left if incorrect
</p> </header> <div class="stats" id="stats" data-astro-cid-j7pv25f6> <span class="stat incorrect" data-astro-cid-j7pv25f6> <span class="icon" data-astro-cid-j7pv25f6>✗</span> <span id="incorrect-count" data-astro-cid-j7pv25f6>0</span> </span> <span class="stat correct" data-astro-cid-j7pv25f6> <span class="icon" data-astro-cid-j7pv25f6>✓</span> <span id="correct-count" data-astro-cid-j7pv25f6>0</span> </span> </div> <div class="card-container" id="card-container" data-astro-cid-j7pv25f6> <div class="card" id="card" data-astro-cid-j7pv25f6> <div class="stamp stamp-correct" id="stamp-correct" data-astro-cid-j7pv25f6>
CORRECT
</div> <div class="stamp stamp-incorrect" id="stamp-incorrect" data-astro-cid-j7pv25f6>
NOPE
</div> <div class="card-image" id="card-image" data-astro-cid-j7pv25f6> <div class="loading" data-astro-cid-j7pv25f6>Loading...</div> </div> <div class="card-name" id="card-name" data-astro-cid-j7pv25f6></div> </div> <div class="swipe-indicator left" id="indicator-left" data-astro-cid-j7pv25f6>✗</div> <div class="swipe-indicator right" id="indicator-right" data-astro-cid-j7pv25f6>✓</div> </div> <div class="done-message" id="done-message" style="display: none;" data-astro-cid-j7pv25f6> <h2 data-astro-cid-j7pv25f6>All Done!</h2> <p data-astro-cid-j7pv25f6>You've reviewed all images.</p> <button onclick="location.reload()" data-astro-cid-j7pv25f6>Start Over</button> </div> <div class="buttons" data-astro-cid-j7pv25f6> <button class="btn incorrect" id="btn-incorrect" aria-label="Mark as incorrect" data-astro-cid-j7pv25f6>
✗
</button> <button class="btn undo" id="btn-undo" aria-label="Undo last swipe" disabled data-astro-cid-j7pv25f6>
↩
</button> <button class="btn correct" id="btn-correct" aria-label="Mark as correct" data-astro-cid-j7pv25f6>
✓
</button> </div> </div>  ${renderScript($$result, "D:/work/photoclean/src/pages/index.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "D:/work/photoclean/src/pages/index.astro", void 0);

const $$file = "D:/work/photoclean/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
