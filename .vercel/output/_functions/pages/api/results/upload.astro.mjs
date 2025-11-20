import { b as updateImageUrl } from '../../../chunks/db_v9b71nIq.mjs';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const imageId = formData.get("imageId");
    if (!file || !imageId) {
      return new Response(JSON.stringify({
        error: "Missing file or imageId"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const imageIdNum = parseInt(imageId.toString(), 10);
    if (isNaN(imageIdNum)) {
      return new Response(JSON.stringify({
        error: "Invalid imageId"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${imageIdNum}-${Date.now()}.${ext}`;
    const uploadsDir = join(process.cwd(), "public", "uploads");
    mkdirSync(uploadsDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    const filepath = join(uploadsDir, filename);
    writeFileSync(filepath, buffer);
    const newUrl = `/uploads/${filename}`;
    const success = await updateImageUrl(imageIdNum, newUrl);
    if (!success) {
      return new Response(JSON.stringify({
        error: "Image not found"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      newUrl
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({
      error: "Upload failed"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
