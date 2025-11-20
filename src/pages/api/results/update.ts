import type { APIRoute } from 'astro';
import { updateSwipeResult, deleteSwipeResult } from '../../../lib/db';

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, isCorrect } = body;

    if (typeof id !== 'number' || typeof isCorrect !== 'boolean') {
      return new Response(JSON.stringify({
        error: 'Invalid request body. Expected { id: number, isCorrect: boolean }'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const success = updateSwipeResult(id, isCorrect);

    if (!success) {
      return new Response(JSON.stringify({ error: 'Result not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
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

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id } = body;

    if (typeof id !== 'number') {
      return new Response(JSON.stringify({
        error: 'Invalid request body. Expected { id: number }'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const success = deleteSwipeResult(id);

    if (!success) {
      return new Response(JSON.stringify({ error: 'Result not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
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
