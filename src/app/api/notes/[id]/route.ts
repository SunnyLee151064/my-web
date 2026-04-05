import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// 根据 ID 或 slug 获取笔记
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const isNumeric = /^\d+$/.test(id);
    let notes;
    if (isNumeric) {
      notes = await sql`SELECT n.id, n.title, n.content, n.slug, n.note_book_id, n.created_at, nb.name as note_book_name FROM notes n LEFT JOIN note_books nb ON n.note_book_id = nb.id WHERE n.id = ${parseInt(id)}`;
    } else {
      notes = await sql`SELECT n.id, n.title, n.content, n.slug, n.note_book_id, n.created_at, nb.name as note_book_name FROM notes n LEFT JOIN note_books nb ON n.note_book_id = nb.id WHERE n.slug = ${id}`;
    }

    if (notes.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, note: notes[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch note' },
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
    const { title, content, note_book_id } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const targetNoteBook = note_book_id || 1;

    const result = await sql`
      UPDATE notes
      SET title = ${title}, content = ${content}, note_book_id = ${targetNoteBook}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, title, slug, note_book_id
    `;

    // 记录更新笔记活动
    await sql`
      INSERT INTO activities (type, action, item_id, item_title, item_slug)
      VALUES ('note', 'update', ${result[0].id}, ${title}, ${result[0].slug})
    `;

    return NextResponse.json({ success: true, note: result[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update note' },
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
    
    // 先获取被删除的笔记信息
    const notes = await sql`SELECT title, slug FROM notes WHERE id = ${id}`;
    
    await sql`DELETE FROM notes WHERE id = ${id}`;

    // 记录删除笔记活动
    if (notes.length > 0) {
      await sql`
        INSERT INTO activities (type, action, item_id, item_title, item_slug)
        VALUES ('note', 'delete', ${parseInt(id)}, ${notes[0].title}, ${notes[0].slug})
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}
