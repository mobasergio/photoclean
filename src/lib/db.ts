import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../../data/swipes.db');

// Ensure data directory exists
import { mkdirSync } from 'fs';
mkdirSync(join(__dirname, '../../data'), { recursive: true });

const db = new Database(dbPath);

// Initialize tables
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

// Get all images that haven't been swiped yet
export function getUnswipedImages(): Image[] {
  const stmt = db.prepare(`
    SELECT i.* FROM images i
    LEFT JOIN swipe_results sr ON i.id = sr.image_id
    WHERE sr.id IS NULL
    ORDER BY i.id
  `);
  return stmt.all() as Image[];
}

// Get next unswiped image
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

// Save swipe result
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

// Add a new image
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

// Get all results
export function getAllResults(): (SwipeResult & { image_name: string; image_url: string })[] {
  const stmt = db.prepare(`
    SELECT sr.*, i.name as image_name, i.image_url
    FROM swipe_results sr
    JOIN images i ON sr.image_id = i.id
    ORDER BY sr.created_at DESC
  `);
  return stmt.all() as (SwipeResult & { image_name: string; image_url: string })[];
}

// Get results filtered by correct/incorrect
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

// Update a swipe result
export function updateSwipeResult(id: number, isCorrect: boolean): boolean {
  const result = db.prepare('UPDATE swipe_results SET is_correct = ? WHERE id = ?').run(isCorrect ? 1 : 0, id);
  return result.changes > 0;
}

// Delete a swipe result
export function deleteSwipeResult(id: number): boolean {
  const result = db.prepare('DELETE FROM swipe_results WHERE id = ?').run(id);
  return result.changes > 0;
}

// Get statistics
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

// Undo last swipe - returns the image that was restored and whether it was correct
export function undoLastSwipe(): { image: Image; wasCorrect: boolean } | null {
  // Get the last swipe result
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

  // Delete the swipe result
  db.prepare('DELETE FROM swipe_results WHERE id = ?').run(lastSwipe.id);

  // Return the image that was restored and whether it was correct
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

// Check if there are any swipes to undo
export function hasSwipesToUndo(): boolean {
  const result = db.prepare('SELECT COUNT(*) as count FROM swipe_results').get() as { count: number };
  return result.count > 0;
}

// Seed sample data if no images exist
export function seedSampleData(): void {
  const count = db.prepare('SELECT COUNT(*) as count FROM images').get() as { count: number };

  if (count.count === 0) {
    const sampleImages = [
      { name: 'Mountain Sunset', url: 'https://picsum.photos/seed/mountain/400/320' },
      { name: 'Ocean Beach', url: 'https://picsum.photos/seed/beach/400/320' },
      { name: 'Forest Trail', url: 'https://picsum.photos/seed/forest/400/320' },
      { name: 'City Skyline', url: 'https://picsum.photos/seed/city/400/320' },
      { name: 'Desert Dunes', url: 'https://picsum.photos/seed/desert/400/320' },
    ];

    const insertStmt = db.prepare('INSERT INTO images (name, image_url) VALUES (?, ?)');
    for (const img of sampleImages) {
      insertStmt.run(img.name, img.url);
    }
  }
}

export default db;
