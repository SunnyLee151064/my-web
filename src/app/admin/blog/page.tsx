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

async function deletePost(id: number) {
  'use server';
  try {
    await sql`DELETE FROM posts WHERE id = ${id}`;
  } catch (error) {
    console.error('Delete error:', error);
  }
}

export default async function AdminBlogPage() {
  const posts = await getPosts();

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>✏️ 管理博客</h1>

      <Link
        href="/admin/blog/new"
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          background: '#0066cc',
          color: 'white',
          borderRadius: '4px',
          textDecoration: 'none',
          marginBottom: '2rem'
        }}
      >
        + 新建文章
      </Link>

      {posts.length === 0 ? (
        <p style={{ color: '#666' }}>暂无文章</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div>
                <Link href={`/blog/${post.slug}`} style={{ color: '#333', textDecoration: 'none' }}>
                  <h3 style={{ margin: '0 0 0.5rem' }}>{post.title}</h3>
                </Link>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                  {new Date(post.created_at).toLocaleDateString('zh-CN')}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                  href={`/admin/blog/edit/${post.id}`}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#f0f0f0',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    color: '#333'
                  }}
                >
                  编辑
                </Link>
                <form action={async () => {
                  'use server';
                  await deletePost(post.id);
                }}>
                  <button
                    type="submit"
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#ff4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    删除
                  </button>
                </form>
              </div>
            </div>
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