import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const db = sql();
    const posts = await db`
      SELECT id, title, slug, created_at FROM posts
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('GET posts error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts', posts: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, slug } = await request.json();

    if (!title || !content || !slug) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = sql();
    const result = await db`
      INSERT INTO posts (title, content, slug)
      VALUES (${title}, ${content}, ${slug})
      RETURNING id, title, slug, created_at
    `;

    return NextResponse.json({ success: true, post: result[0] });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}