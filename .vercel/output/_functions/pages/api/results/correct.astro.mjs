import { a as getFilteredResults } from '../../../chunks/db_BuFd1F5a.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async () => {
  const results = await getFilteredResults(true);
  return new Response(JSON.stringify(results), {
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
