import { f as undoLastSwipe, h as hasSwipesToUndo } from '../../chunks/db_v9b71nIq.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async () => {
  const result = await undoLastSwipe();
  if (!result) {
    return new Response(JSON.stringify({
      success: false,
      message: "No swipes to undo"
    }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
  return new Response(JSON.stringify({
    success: true,
    image: result.image,
    wasCorrect: result.wasCorrect,
    hasMore: await hasSwipesToUndo()
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
