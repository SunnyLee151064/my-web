import Link from 'next/link';
import { sql } from '@/lib/db';
import ReactMarkdown from 'react-markdown';

async function getPost(slug: string) {
  try {
    const posts = await sql`
      SELECT id, title, content, created_at, updated_at FROM posts WHERE slug = ${slug}
    `;
    return posts[0] || null;
  } catch {
    return null;
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>文章不存在</h1>
        <Link href="/blog" style={{ color: '#0066cc' }}>返回博客列表</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link
        href="/blog"
        style={{ color: '#0066cc', textDecoration: 'underline', marginBottom: '1rem', display: 'block' }}
      >
        ← 返回博客列表
      </Link>

      <h1 style={{ marginBottom: '0.5rem' }}>{post.title}</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        发布于 {new Date(post.created_at).toLocaleDateString('zh-CN')}
        {post.updated_at !== post.created_at && (
          <> · 更新于 {new Date(post.updated_at).toLocaleDateString('zh-CN')}</>
        )}
      </p>

      <article style={{ lineHeight: '1.8' }}>
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </article>
    </div>
  );
}