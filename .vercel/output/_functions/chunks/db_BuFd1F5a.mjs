import { createClient } from '@libsql/client';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = dirname(__filename$1);
const db = createClient({
  url: "libsql://photoclean-mobasergio.aws-eu-west-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjM2NTI5ODcsImlkIjoiMzMxYjEwYzEtN2ZhMS00NDBjLTgxMzktMDZhNzVkYzI1MWExIiwicmlkIjoiZWI2N2VlZjYtNTRhYS00NmE4LWFlYTMtYWUzNDIyNzA5OTMyIn0.5UkC0ciM_RD1ZzJbnLIrhg8RGkpWZ1CwDFbQTKy5tsb5V9PC65ae-QYamEWgnz7bq6Uq8UrizLaKc7ARtlXOAA"
});
await db.execute(`
  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
await db.execute(`
  CREATE TABLE IF NOT EXISTS swipe_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_id INTEGER NOT NULL,
    is_correct BOOLEAN NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (image_id) REFERENCES images(id)
  );
`);
async function getNextImage() {
  const result = await db.execute(`
    SELECT i.* FROM images i
    LEFT JOIN swipe_results sr ON i.id = sr.image_id
    WHERE sr.id IS NULL
    ORDER BY i.id
    LIMIT 1
  `);
  return result.rows[0];
}
async function saveSwipeResult(imageId, isCorrect) {
  const result = await db.execute({
    sql: `INSERT INTO swipe_results (image_id, is_correct) VALUES (?, ?)`,
    args: [imageId, isCorrect ? 1 : 0]
  });
  return {
    id: Number(result.lastInsertRowid),
    image_id: imageId,
    is_correct: isCorrect,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
}
async function getAllResults() {
  const result = await db.execute(`
    SELECT sr.*, i.name as image_name, i.image_url
    FROM swipe_results sr
    JOIN images i ON sr.image_id = i.id
    ORDER BY sr.created_at DESC
  `);
  return result.rows;
}
async function getFilteredResults(isCorrect) {
  const result = await db.execute({
    sql: `
      SELECT sr.*, i.name as image_name, i.image_url
      FROM swipe_results sr
      JOIN images i ON sr.image_id = i.id
      WHERE sr.is_correct = ?
      ORDER BY sr.created_at DESC
    `,
    args: [isCorrect ? 1 : 0]
  });
  return result.rows;
}
async function updateSwipeResult(id, isCorrect) {
  const result = await db.execute({
    sql: "UPDATE swipe_results SET is_correct = ? WHERE id = ?",
    args: [isCorrect ? 1 : 0, id]
  });
  return result.rowsAffected > 0;
}
async function deleteSwipeResult(id) {
  const result = await db.execute({
    sql: "DELETE FROM swipe_results WHERE id = ?",
    args: [id]
  });
  return result.rowsAffected > 0;
}
async function updateImageUrl(imageId, newUrl) {
  const result = await db.execute({
    sql: "UPDATE images SET image_url = ? WHERE id = ?",
    args: [newUrl, imageId]
  });
  return result.rowsAffected > 0;
}
async function getStats() {
  const result = await db.execute(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct,
      SUM(CASE WHEN is_correct = 0 THEN 1 ELSE 0 END) as incorrect
    FROM swipe_results
  `);
  const row = result.rows[0];
  return {
    total: Number(row.total) || 0,
    correct: Number(row.correct) || 0,
    incorrect: Number(row.incorrect) || 0
  };
}
async function undoLastSwipe() {
  const lastSwipeResult = await db.execute(`
    SELECT sr.id, sr.image_id, sr.is_correct, i.name, i.image_url, i.created_at
    FROM swipe_results sr
    JOIN images i ON sr.image_id = i.id
    ORDER BY sr.id DESC
    LIMIT 1
  `);
  if (lastSwipeResult.rows.length === 0) {
    return null;
  }
  const lastSwipe = lastSwipeResult.rows[0];
  await db.execute({
    sql: "DELETE FROM swipe_results WHERE id = ?",
    args: [lastSwipe.id]
  });
  return {
    image: {
      id: Number(lastSwipe.image_id),
      name: lastSwipe.name,
      image_url: lastSwipe.image_url,
      created_at: lastSwipe.created_at
    },
    wasCorrect: lastSwipe.is_correct === 1
  };
}
async function hasSwipesToUndo() {
  const result = await db.execute("SELECT COUNT(*) as count FROM swipe_results");
  const row = result.rows[0];
  return Number(row.count) > 0;
}
async function seedSampleData() {
  const countResult = await db.execute("SELECT COUNT(*) as count FROM images");
  const count = countResult.rows[0].count;
  if (Number(count) === 0) {
    const imagesDir = join(__dirname$1, "../images");
    const imageFiles = readdirSync(imagesDir).filter((file) => file.endsWith(".jpg"));
    for (const file of imageFiles) {
      const name = file.replace(".jpg", "").replace(/_/g, " ");
      const url = `/images/${file}`;
      await db.execute({
        sql: "INSERT INTO images (name, image_url) VALUES (?, ?)",
        args: [name, url]
      });
    }
  }
}

export { getFilteredResults as a, updateImageUrl as b, getStats as c, deleteSwipeResult as d, getAllResults as e, saveSwipeResult as f, getNextImage as g, undoLastSwipe as h, hasSwipesToUndo as i, seedSampleData as s, updateSwipeResult as u };
