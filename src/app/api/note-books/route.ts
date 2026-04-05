import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// 获取所有笔记本
export async function GET() {
  try {
    const noteBooks = await sql`
      SELECT id, name, is_default, created_at FROM note_books
      ORDER BY is_default DESC, created_at DESC
    `;
    return NextResponse.json({ success: true, noteBooks });
  } catch (error) {
    console.error('GET note books error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch note books' },
      { status: 500 }
    );
  }
}

// 创建笔记本
export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Note book name is required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO note_books (name)
      VALUES (${name})
      RETURNING id, name, is_default, created_at
    `;

    // 记录创建笔记本活动
    await sql`
      INSERT INTO activities (type, action, item_id, item_title)
      VALUES ('notebook', 'create', ${result[0].id}, ${name})
    `;

    return NextResponse.json({ success: true, noteBook: result[0] });
  } catch (error) {
    console.error('Create note book error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create note book' },
      { status: 500 }
    );
  }
}
