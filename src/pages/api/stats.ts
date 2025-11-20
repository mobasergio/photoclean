import type { APIRoute } from 'astro';
import { getStats, getAllResults } from '../../lib/db';

export const GET: APIRoute = async () => {
  const stats = getStats();
  const results = getAllResults();

  return new Response(JSON.stringify({ stats, results }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
