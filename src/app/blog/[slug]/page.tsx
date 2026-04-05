import Link from 'next/link';
import { sql } from '@/lib/db';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';

// 强制动态渲染
export const dynamic = 'force-dynamic';

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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link
        href="/blog"
        style={{ color: '#0066cc', textDecoration: 'underline', marginBottom: '1rem', display: 'block' }}
      >
        Back to Blog
      </Link>

      <h1 style={{ marginBottom: '0.5rem' }}>{post.title}</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        {new Date(post.created_at).toLocaleDateString()}
      </p>

      <article style={{ lineHeight: '1.8' }}>
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </article>
    </div>
  );
}