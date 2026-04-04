import Link from 'next/link';
import { sql } from '@/lib/db';

async function getPosts() {
  try {
    const posts = await sql`
      SELECT id, title, slug, created_at FROM posts
      ORDER BY created_at DESC
    `;
    return posts;
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>📝 博客</h1>

      {posts.length === 0 ? (
        <p style={{ color: '#666' }}>暂无文章，去写一篇吧！</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              style={{
                display: 'block',
                padding: '1rem',
                background: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#333',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <h2 style={{ margin: '0 0 0.5rem' }}>{post.title}</h2>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                {new Date(post.created_at).toLocaleDateString('zh-CN')}
              </p>
            </Link>
          ))}
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <Link
          href="/welcome"
          style={{ color: '#0066cc', textDecoration: 'underline' }}
        >
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}