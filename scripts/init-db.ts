import { neon } from '@neondatabase/serverless';

// 创建数据库连接
const sql = neon(process.env.POSTGRES_URL!);

// 初始化数据库表
async function initDatabase() {
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

  // 创建 posts 表（添加 notebook_id）
  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      notebook_id INTEGER DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (notebook_id) REFERENCES notebooks(id)
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

  // 检查是否已有默认笔记本，如果没有则创建
  const existingNotebook = await sql`SELECT id FROM notebooks WHERE is_default = TRUE`;
  if (existingNotebook.length === 0) {
    await sql`INSERT INTO notebooks (name, is_default) VALUES ('默认笔记', TRUE)`;
  }

  console.log('Database tables created successfully');
}

initDatabase().catch(console.error);