import { s as saveSwipeResult } from '../../chunks/db_v9b71nIq.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { imageId, isCorrect } = body;
    if (typeof imageId !== "number" || typeof isCorrect !== "boolean") {
      return new Response(JSON.stringify({
        error: "Invalid request body. Expected { imageId: number, isCorrect: boolean }"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const result = await saveSwipeResult(imageId, isCorrect);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
