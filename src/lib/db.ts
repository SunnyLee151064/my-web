import { neon } from '@neondatabase/serverless';

// 禁用 Vercel Edge 警告
if (typeof window === 'undefined') {
  (globalThis as any).fetch ??= fetch;
}

export const sql = process.env.POSTGRES_URL
  ? neon(process.env.POSTGRES_URL)
  : null;

// 初始化数据库表
export async function initDatabase() {
  if (!sql) {
    throw new Error('Database connection not configured');
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

  // 创建 posts 表
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

  console.log('Database tables created successfully');
}