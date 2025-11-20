import type { APIRoute } from 'astro';
import { getNextImage, seedSampleData } from '../../lib/db';

export const GET: APIRoute = async () => {
  // Seed sample data on first request
  seedSampleData();

  const image = getNextImage();

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
