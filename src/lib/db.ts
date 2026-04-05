import { neon } from '@neondatabase/serverless';

const url = process.env.POSTGRES_URL;

export const sql = (...args: Parameters<ReturnType<typeof neon>>) => {
  if (!url) {
    throw new Error('POSTGRES_URL is not configured');
  }
  const db = neon(url);
  return db(...args);
};

export async function initDatabase() {
  if (!url) {
    throw new Error('Database is not configured. Please set POSTGRES_URL environment variable.');
  }

  // 创建 users 表
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // 创建 notebooks 表
  await sql`
    CREATE TABLE IF NOT EXISTS notebooks (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      is_default BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // 检查是否已有默认笔记本，如果没有则创建
  const existingNotebook = await sql`SELECT id FROM notebooks WHERE is_default = TRUE`;
  if (existingNotebook.length === 0) {
    await sql`INSERT INTO notebooks (name, is_default) VALUES ('默认笔记', TRUE)`;
  }

  // 创建 posts 表（添加 notebook_id）
  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // 添加 notebook_id 列（如果不存在）
  await sql`
    ALTER TABLE posts ADD COLUMN IF NOT EXISTS notebook_id INTEGER DEFAULT 1
  `;

  // 添加外键约束（如果不存在）
  await sql`
    ALTER TABLE posts ADD CONSTRAINT IF NOT EXISTS posts_notebook_id_fkey FOREIGN KEY (notebook_id) REFERENCES notebooks(id)
  `;

  // 创建 photo_albums 表
  await sql`
    CREATE TABLE IF NOT EXISTS photo_albums (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      is_default BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // 检查是否已有默认图集，如果没有则创建
  const existingAlbum = await sql`SELECT id FROM photo_albums WHERE is_default = TRUE`;
  if (existingAlbum.length === 0) {
    await sql`INSERT INTO photo_albums (name, is_default) VALUES ('默认图集', TRUE)`;
  }

  // 创建 photos 表
  await sql`
    CREATE TABLE IF NOT EXISTS photos (
      id SERIAL PRIMARY KEY,
      url TEXT NOT NULL,
      blob_id VARCHAR(255),
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // 添加 album_id 列（如果不存在）
  await sql`
    ALTER TABLE photos ADD COLUMN IF NOT EXISTS album_id INTEGER DEFAULT 1
  `;

  // 添加外键约束（如果不存在）
  await sql`
    ALTER TABLE photos ADD CONSTRAINT IF NOT EXISTS photos_album_id_fkey FOREIGN KEY (album_id) REFERENCES photo_albums(id)
  `;

  console.log('Database tables created successfully');
}