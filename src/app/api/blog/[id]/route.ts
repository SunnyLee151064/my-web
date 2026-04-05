import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// 根据 ID 或 slug 获取文章
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const isNumeric = /^\d+$/.test(id);
    let posts;
    if (isNumeric) {
      posts = await sql`SELECT p.id, p.title, p.content, p.slug, p.notebook_id, p.created_at, n.name as notebook_name FROM posts p LEFT JOIN notebooks n ON p.notebook_id = n.id WHERE p.id = ${parseInt(id)}`;
    } else {
      posts = await sql`SELECT p.id, p.title, p.content, p.slug, p.notebook_id, p.created_at, n.name as notebook_name FROM posts p LEFT JOIN notebooks n ON p.notebook_id = n.id WHERE p.slug = ${id}`;
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
    const { title, content, notebook_id } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const targetNotebook = notebook_id || 1;

    const result = await sql`
      UPDATE posts
      SET title = ${title}, content = ${content}, notebook_id = ${targetNotebook}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, title, slug, notebook_id
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