import { createClient } from '@libsql/client';

// Get environment variables
const TURSO_DATABASE_URL = import.meta.env.TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = import.meta.env.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;

// Validate environment variables
if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  throw new Error(
    'Missing Turso credentials. Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables. ' +
    'See TURSO_SETUP.md for instructions.'
  );
}

// Initialize Turso client
const db = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

// Lazy initialization flag
let isInitialized = false;

// Initialize database schema (called on first use)
async function ensureInitialized() {
  if (isInitialized) return;

  try {
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

    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw new Error(
      'Database initialization failed. Please check your Turso credentials and database connection. ' +
      `Error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

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

export async function getUnswipedImages(): Promise<Image[]> {
  await ensureInitialized();
  const result = await db.execute(`
    SELECT i.* FROM images i
    LEFT JOIN swipe_results sr ON i.id = sr.image_id
    WHERE sr.id IS NULL
    ORDER BY i.id
  `);
  return result.rows as unknown as Image[];
}

export async function getNextImage(): Promise<Image | undefined> {
  await ensureInitialized();
  const result = await db.execute(`
    SELECT i.* FROM images i
    LEFT JOIN swipe_results sr ON i.id = sr.image_id
    WHERE sr.id IS NULL
    ORDER BY i.id
    LIMIT 1
  `);
  return result.rows[0] as unknown as Image | undefined;
}

export async function saveSwipeResult(imageId: number, isCorrect: boolean): Promise<SwipeResult> {
  await ensureInitialized();
  const result = await db.execute({
    sql: `INSERT INTO swipe_results (image_id, is_correct) VALUES (?, ?)`,
    args: [imageId, isCorrect ? 1 : 0]
  });

  return {
    id: Number(result.lastInsertRowid),
    image_id: imageId,
    is_correct: isCorrect,
    created_at: new Date().toISOString()
  };
}

export async function addImage(name: string, imageUrl: string): Promise<Image> {
  await ensureInitialized();
  const result = await db.execute({
    sql: `INSERT INTO images (name, image_url) VALUES (?, ?)`,
    args: [name, imageUrl]
  });

  return {
    id: Number(result.lastInsertRowid),
    name,
    image_url: imageUrl,
    created_at: new Date().toISOString()
  };
}

export async function getAllResults(): Promise<(SwipeResult & { image_name: string; image_url: string })[]> {
  await ensureInitialized();
  const result = await db.execute(`
    SELECT sr.*, i.name as image_name, i.image_url
    FROM swipe_results sr
    JOIN images i ON sr.image_id = i.id
    ORDER BY sr.created_at DESC
  `);
  return result.rows as unknown as (SwipeResult & { image_name: string; image_url: string })[];
}

export async function getFilteredResults(isCorrect: boolean): Promise<(SwipeResult & { image_name: string; image_url: string })[]> {
  await ensureInitialized();
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
  return result.rows as unknown as (SwipeResult & { image_name: string; image_url: string })[];
}

export async function updateSwipeResult(id: number, isCorrect: boolean): Promise<boolean> {
  await ensureInitialized();
  const result = await db.execute({
    sql: 'UPDATE swipe_results SET is_correct = ? WHERE id = ?',
    args: [isCorrect ? 1 : 0, id]
  });
  return result.rowsAffected > 0;
}

export async function deleteSwipeResult(id: number): Promise<boolean> {
  await ensureInitialized();
  const result = await db.execute({
    sql: 'DELETE FROM swipe_results WHERE id = ?',
    args: [id]
  });
  return result.rowsAffected > 0;
}

export async function updateImageUrl(imageId: number, newUrl: string): Promise<boolean> {
  await ensureInitialized();
  const result = await db.execute({
    sql: 'UPDATE images SET image_url = ? WHERE id = ?',
    args: [newUrl, imageId]
  });
  return result.rowsAffected > 0;
}

export async function getStats(): Promise<{ total: number; correct: number; incorrect: number }> {
  await ensureInitialized();
  const result = await db.execute(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct,
      SUM(CASE WHEN is_correct = 0 THEN 1 ELSE 0 END) as incorrect
    FROM swipe_results
  `);

  const row = result.rows[0] as any;
  return {
    total: Number(row.total) || 0,
    correct: Number(row.correct) || 0,
    incorrect: Number(row.incorrect) || 0
  };
}

export async function undoLastSwipe(): Promise<{ image: Image; wasCorrect: boolean } | null> {
  await ensureInitialized();
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

  const lastSwipe = lastSwipeResult.rows[0] as any;

  await db.execute({
    sql: 'DELETE FROM swipe_results WHERE id = ?',
    args: [lastSwipe.id]
  });

  return {
    image: {
      id: Number(lastSwipe.image_id),
      name: lastSwipe.name as string,
      image_url: lastSwipe.image_url as string,
      created_at: lastSwipe.created_at as string
    },
    wasCorrect: lastSwipe.is_correct === 1
  };
}

export async function hasSwipesToUndo(): Promise<boolean> {
  await ensureInitialized();
  const result = await db.execute('SELECT COUNT(*) as count FROM swipe_results');
  const row = result.rows[0] as any;
  return Number(row.count) > 0;
}



export default db;
