import type { APIRoute } from 'astro';
import { undoLastSwipe } from '../../lib/db';

export const POST: APIRoute = async () => {
  const restoredImage = undoLastSwipe();

  if (!restoredImage) {
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
    image: restoredImage
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
