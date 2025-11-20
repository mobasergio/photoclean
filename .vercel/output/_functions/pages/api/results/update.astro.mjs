import { u as updateSwipeResult, d as deleteSwipeResult } from '../../../chunks/db_BuFd1F5a.mjs';
export { renderers } from '../../../renderers.mjs';

const PUT = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, isCorrect } = body;
    if (typeof id !== "number" || typeof isCorrect !== "boolean") {
      return new Response(JSON.stringify({
        error: "Invalid request body. Expected { id: number, isCorrect: boolean }"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const success = await updateSwipeResult(id, isCorrect);
    if (!success) {
      return new Response(JSON.stringify({ error: "Result not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ success: true }), {
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
const DELETE = async ({ request }) => {
  try {
    const body = await request.json();
    const { id } = body;
    if (typeof id !== "number") {
      return new Response(JSON.stringify({
        error: "Invalid request body. Expected { id: number }"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const success = await deleteSwipeResult(id);
    if (!success) {
      return new Response(JSON.stringify({ error: "Result not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ success: true }), {
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
  DELETE,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
