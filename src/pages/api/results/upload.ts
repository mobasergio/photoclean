import type { APIRoute } from 'astro';
import { updateImageUrl } from '../../../lib/db';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const imageId = formData.get('imageId');

    if (!file || !imageId) {
      return new Response(JSON.stringify({
        error: 'Missing file or imageId'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const imageIdNum = parseInt(imageId.toString(), 10);
    if (isNaN(imageIdNum)) {
      return new Response(JSON.stringify({
        error: 'Invalid imageId'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${imageIdNum}-${Date.now()}.${ext}`;

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    mkdirSync(uploadsDir, { recursive: true });

    // Save file
    const buffer = Buffer.from(await file.arrayBuffer());
    const filepath = join(uploadsDir, filename);
    writeFileSync(filepath, buffer);

    // Update database with new URL
    const newUrl = `/uploads/${filename}`;
    const success = updateImageUrl(imageIdNum, newUrl);

    if (!success) {
      return new Response(JSON.stringify({
        error: 'Image not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      newUrl
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({
      error: 'Upload failed'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
