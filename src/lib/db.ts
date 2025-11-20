import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../../data/swipes.db');

import { mkdirSync, readdirSync } from 'fs';
mkdirSync(join(__dirname, '../../data'), { recursive: true });

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS swipe_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_id INTEGER NOT NULL,
    is_correct BOOLEAN NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (image_id) REFERENCES images(id)
  );
`);

export interface Image {
  id: number;
  name: string;
  image_url: string;
  created_at: string;
}

export interface SwipeResult {
  id: number;
  image_id: number;
  is_correct: boolean;
  created_at: string;
}

export function getUnswipedImages(): Image[] {
  const stmt = db.prepare(`
    SELECT i.* FROM images i
    LEFT JOIN swipe_results sr ON i.id = sr.image_id
    WHERE sr.id IS NULL
    ORDER BY i.id
  `);
  return stmt.all() as Image[];
}

export function getNextImage(): Image | undefined {
  const stmt = db.prepare(`
    SELECT i.* FROM images i
    LEFT JOIN swipe_results sr ON i.id = sr.image_id
    WHERE sr.id IS NULL
    ORDER BY i.id
    LIMIT 1
  `);
  return stmt.get() as Image | undefined;
}

export function saveSwipeResult(imageId: number, isCorrect: boolean): SwipeResult {
  const stmt = db.prepare(`
    INSERT INTO swipe_results (image_id, is_correct)
    VALUES (?, ?)
  `);
  const result = stmt.run(imageId, isCorrect ? 1 : 0);
  return {
    id: result.lastInsertRowid as number,
    image_id: imageId,
    is_correct: isCorrect,
    created_at: new Date().toISOString()
  };
}

export function addImage(name: string, imageUrl: string): Image {
  const stmt = db.prepare(`
    INSERT INTO images (name, image_url)
    VALUES (?, ?)
  `);
  const result = stmt.run(name, imageUrl);
  return {
    id: result.lastInsertRowid as number,
    name,
    image_url: imageUrl,
    created_at: new Date().toISOString()
  };
}

export function getAllResults(): (SwipeResult & { image_name: string; image_url: string })[] {
  const stmt = db.prepare(`
    SELECT sr.*, i.name as image_name, i.image_url
    FROM swipe_results sr
    JOIN images i ON sr.image_id = i.id
    ORDER BY sr.created_at DESC
  `);
  return stmt.all() as (SwipeResult & { image_name: string; image_url: string })[];
}

export function getFilteredResults(isCorrect: boolean): (SwipeResult & { image_name: string; image_url: string })[] {
  const stmt = db.prepare(`
    SELECT sr.*, i.name as image_name, i.image_url
    FROM swipe_results sr
    JOIN images i ON sr.image_id = i.id
    WHERE sr.is_correct = ?
    ORDER BY sr.created_at DESC
  `);
  return stmt.all(isCorrect ? 1 : 0) as (SwipeResult & { image_name: string; image_url: string })[];
}

export function updateSwipeResult(id: number, isCorrect: boolean): boolean {
  const result = db.prepare('UPDATE swipe_results SET is_correct = ? WHERE id = ?').run(isCorrect ? 1 : 0, id);
  return result.changes > 0;
}

export function deleteSwipeResult(id: number): boolean {
  const result = db.prepare('DELETE FROM swipe_results WHERE id = ?').run(id);
  return result.changes > 0;
}

export function updateImageUrl(imageId: number, newUrl: string): boolean {
  const result = db.prepare('UPDATE images SET image_url = ? WHERE id = ?').run(newUrl, imageId);
  return result.changes > 0;
}

export function getStats(): { total: number; correct: number; incorrect: number } {
  const stmt = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct,
      SUM(CASE WHEN is_correct = 0 THEN 1 ELSE 0 END) as incorrect
    FROM swipe_results
  `);
  const result = stmt.get() as { total: number; correct: number; incorrect: number };
  return {
    total: result.total || 0,
    correct: result.correct || 0,
    incorrect: result.incorrect || 0
  };
}

export function undoLastSwipe(): { image: Image; wasCorrect: boolean } | null {
  const lastSwipe = db.prepare(`
    SELECT sr.id, sr.image_id, sr.is_correct, i.name, i.image_url, i.created_at
    FROM swipe_results sr
    JOIN images i ON sr.image_id = i.id
    ORDER BY sr.id DESC
    LIMIT 1
  `).get() as { id: number; image_id: number; is_correct: number; name: string; image_url: string; created_at: string } | undefined;

  if (!lastSwipe) {
    return null;
  }

  db.prepare('DELETE FROM swipe_results WHERE id = ?').run(lastSwipe.id);

  return {
    image: {
      id: lastSwipe.image_id,
      name: lastSwipe.name,
      image_url: lastSwipe.image_url,
      created_at: lastSwipe.created_at
    },
    wasCorrect: lastSwipe.is_correct === 1
  };
}

export function hasSwipesToUndo(): boolean {
  const result = db.prepare('SELECT COUNT(*) as count FROM swipe_results').get() as { count: number };
  return result.count > 0;
}

export function seedSampleData(): void {
  const count = db.prepare('SELECT COUNT(*) as count FROM images').get() as { count: number };

  if (count.count === 0) {
    // Read all images from src/images directory
    const imagesDir = join(__dirname, '../images');
    const imageFiles = readdirSync(imagesDir).filter(file => file.endsWith('.jpg'));

    const insertStmt = db.prepare('INSERT INTO images (name, image_url) VALUES (?, ?)');
    for (const file of imageFiles) {
      // Extract a readable name from the filename (remove extension and replace underscores with spaces)
      const name = file.replace('.jpg', '').replace(/_/g, ' ');
      // Use relative path from the public directory
      const url = `/images/${file}`;
      insertStmt.run(name, url);
    }
  }
}

export default db;
