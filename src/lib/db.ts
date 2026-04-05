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
  try {
    await sql`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  } catch (error) {
    // 表已存在，忽略错误
    console.log('Users table already exists');
  }

  // 创建 notebooks 表
  try {
    await sql`
      CREATE TABLE notebooks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  } catch (error) {
    // 表已存在，忽略错误
    console.log('Notebooks table already exists');
  }

  // 检查是否已有默认笔记本，如果没有则创建
  try {
    const existingNotebook = await sql`SELECT id FROM notebooks WHERE is_default = TRUE`;
    if (existingNotebook.length === 0) {
      await sql`INSERT INTO notebooks (name, is_default) VALUES ('默认笔记', TRUE)`;
    }
  } catch (error) {
    console.error('Error checking default notebook:', error);
  }

  // 创建 posts 表
  try {
    await sql`
      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notebook_id INTEGER DEFAULT 1
      )
    `;
  } catch (error) {
    // 表已存在，忽略错误
    console.log('Posts table already exists');
  }

  // 添加外键约束
  try {
    await sql`
      ALTER TABLE posts ADD CONSTRAINT posts_notebook_id_fkey FOREIGN KEY (notebook_id) REFERENCES notebooks(id)
    `;
  } catch (error) {
    // 约束已存在，忽略错误
    console.log('Posts foreign key constraint already exists');
  }

  // 创建 photo_albums 表
  try {
    await sql`
      CREATE TABLE photo_albums (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  } catch (error) {
    // 表已存在，忽略错误
    console.log('Photo albums table already exists');
  }

  // 检查是否已有默认图集，如果没有则创建
  try {
    const existingAlbum = await sql`SELECT id FROM photo_albums WHERE is_default = TRUE`;
    if (existingAlbum.length === 0) {
      await sql`INSERT INTO photo_albums (name, is_default) VALUES ('默认图集', TRUE)`;
    }
  } catch (error) {
    console.error('Error checking default album:', error);
  }

  // 创建 photos 表
  try {
    await sql`
      CREATE TABLE photos (
        id SERIAL PRIMARY KEY,
        url TEXT NOT NULL,
        blob_id VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        album_id INTEGER DEFAULT 1
      )
    `;
  } catch (error) {
    // 表已存在，忽略错误
    console.log('Photos table already exists');
  }

  // 添加外键约束
  try {
    await sql`
      ALTER TABLE photos ADD CONSTRAINT photos_album_id_fkey FOREIGN KEY (album_id) REFERENCES photo_albums(id)
    `;
  } catch (error) {
    // 约束已存在，忽略错误
    console.log('Photos foreign key constraint already exists');
  }

  console.log('Database tables created successfully');
}