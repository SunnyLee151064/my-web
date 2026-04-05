import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// 根据 ID 或 slug 获取文章
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // 判断是 id 还是 slug
    const isNumeric = /^\d+$/.test(id);
    let posts;
    if (isNumeric) {
      posts = await sql`SELECT id, title, content, slug, created_at FROM posts WHERE id = ${parseInt(id)}`;
    } else {
      posts = await sql`SELECT id, title, content, slug, created_at FROM posts WHERE slug = ${id}`;
    }

    if (posts.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post: posts[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE posts
      SET title = ${title}, content = ${content}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, title, slug
    `;

    return NextResponse.json({ success: true, post: result[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await sql`DELETE FROM posts WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}