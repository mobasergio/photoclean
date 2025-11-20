import { g as getNextImage } from '../../chunks/db_v9b71nIq.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async () => {
  const image = await getNextImage();
  if (!image) {
    return new Response(JSON.stringify({
      done: true,
      message: "No more images to review"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
  return new Response(JSON.stringify(image), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
