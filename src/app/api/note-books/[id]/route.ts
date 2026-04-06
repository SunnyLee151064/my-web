import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// 强制使用 Node.js runtime
export const runtime = 'nodejs';

// 获取单个笔记本
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const noteBooks = await sql`
      SELECT id, name, is_default, created_at FROM note_books WHERE id = ${parseInt(id)}
    `;

    if (noteBooks.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Note book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, noteBook: noteBooks[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch note book' },
      { status: 500 }
    );
  }
}

// 更新笔记本
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Note book name is required' },
        { status: 400 }
      );
    }

    // 不能修改默认笔记本
    const existing = await sql`SELECT is_default FROM note_books WHERE id = ${parseInt(id)}`;
    if (existing.length > 0 && existing[0].is_default) {
      return NextResponse.json(
        { success: false, error: 'Cannot modify default note book' },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE note_books SET name = ${name} WHERE id = ${parseInt(id)}
      RETURNING id, name, is_default
    `;

    return NextResponse.json({ success: true, noteBook: result[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update note book' },
      { status: 500 }
    );
  }
}

// 删除笔记本
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);

    // 不能删除默认笔记本
    const existing = await sql`SELECT is_default FROM note_books WHERE id = ${idNum}`;
    if (existing.length > 0 && existing[0].is_default) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete default note book' },
        { status: 400 }
      );
    }

    // 先获取被删除的笔记本信息
    const noteBooks = await sql`SELECT name FROM note_books WHERE id = ${idNum}`;

    // 将该笔记本下的笔记移到默认笔记本
    await sql`
      UPDATE notes SET note_book_id = (
        SELECT id FROM note_books WHERE is_default = TRUE LIMIT 1
      ) WHERE note_book_id = ${idNum}
    `;

    await sql`DELETE FROM note_books WHERE id = ${idNum}`;

    // 记录删除笔记本活动
    if (noteBooks.length > 0) {
      await sql`
        INSERT INTO activities (type, action, item_id, item_title)
        VALUES ('notebook', 'delete', ${idNum}, ${noteBooks[0].name})
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete note book' },
      { status: 500 }
    );
  }
}
