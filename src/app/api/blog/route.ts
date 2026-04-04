import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { title, content, slug } = await request.json();

    if (!title || !content || !slug) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO posts (title, content, slug)
      VALUES (${title}, ${content}, ${slug})
      RETURNING id, title, slug
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