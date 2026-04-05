import { neon } from '@neondatabase/serverless';

// 获取数据库连接
const url = process.env.POSTGRES_URL;

// 创建 sql 函数，在实际调用时才创建数据库连接
export function sql(...args: any[]) {
  if (!url) {
    throw new Error('POSTGRES_URL is not configured');
  }
  const db = neon(url);
  return db(...args);
}

// 初始化数据库表
export async function initDatabase() {
  if (!url) {
    throw new Error('Database is not configured. Please set POSTGRES_URL environment variable.');
  }

  // 创建 users 表
  await sql(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建 posts 表
  await sql(`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建 photos 表
  await sql(`
    CREATE TABLE IF NOT EXISTS photos (
      id SERIAL PRIMARY KEY,
      url TEXT NOT NULL,
      blob_id VARCHAR(255),
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database tables created successfully');
}