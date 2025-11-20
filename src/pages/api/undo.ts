import type { APIRoute } from 'astro';
import { undoLastSwipe, hasSwipesToUndo } from '../../lib/db';

export const POST: APIRoute = async () => {
  const result = await undoLastSwipe();

  if (!result) {
    return new Response(JSON.stringify({
      success: false,
      message: 'No swipes to undo'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    success: true,
    image: result.image,
    wasCorrect: result.wasCorrect,
    hasMore: await hasSwipesToUndo()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

