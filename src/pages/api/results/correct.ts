import type { APIRoute } from 'astro';
import { getFilteredResults } from '../../../lib/db';

export const GET: APIRoute = async () => {
  const results = await getFilteredResults(true);

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

