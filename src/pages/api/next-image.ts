import type { APIRoute } from 'astro';
import { getNextImage } from '../../lib/db';

export const GET: APIRoute = async () => {
  const image = await getNextImage();

  if (!image) {
    return new Response(JSON.stringify({
      done: true,
      message: 'No more images to review'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify(image), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

