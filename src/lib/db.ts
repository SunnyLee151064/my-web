import { neon, NeonQueryFunction } from '@neondatabase/serverless';

// 禁用 Vercel Edge 警告
if (typeof window === 'undefined') {
  (globalThis as any).fetch ??= fetch;
}

// 类型定义
export type Sql = NeonQueryFunction<false, false>;

// 获取数据库连接
const url = process.env.POSTGRES_URL;
const _sql = url ? neon(url) : null;

// 导出 sql，通过类型断言确保可用
export const sql = _sql as Sql;

// 初始化数据库表
export async function initDatabase() {
  if (!url) {
    throw new Error('Database is not configured. Please set POSTGRES_URL environment variable.');
  }

  const db = neon(url);

  // 创建 users 表
  await db`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // 创建 posts 表
  await db`
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
  await db`
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