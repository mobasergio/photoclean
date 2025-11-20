import type { APIRoute } from 'astro';
import { saveSwipeResult } from '../../lib/db';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { imageId, isCorrect } = body;

    if (typeof imageId !== 'number' || typeof isCorrect !== 'boolean') {
      return new Response(JSON.stringify({
        error: 'Invalid request body. Expected { imageId: number, isCorrect: boolean }'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = saveSwipeResult(imageId, isCorrect);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
