import { c as getStats, e as getAllResults } from '../../chunks/db_BuFd1F5a.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async () => {
  const stats = await getStats();
  const results = await getAllResults();
  return new Response(JSON.stringify({ stats, results }), {
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
