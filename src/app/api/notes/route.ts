import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// 获取笔记列表 - 支持搜索和笔记本筛选
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const noteBookId = searchParams.get('note_book_id');

    if (search && noteBookId) {
      const notes = await sql`
        SELECT n.id, n.title, n.slug, n.note_book_id, n.created_at, nb.name as note_book_name
        FROM notes n
        LEFT JOIN note_books nb ON n.note_book_id = nb.id
        WHERE n.title ILIKE ${`%${search}%`} AND n.note_book_id = ${parseInt(noteBookId)}
        ORDER BY n.created_at DESC
      `;
      return NextResponse.json({ success: true, notes });
    } else if (search) {
      const notes = await sql`
        SELECT n.id, n.title, n.slug, n.note_book_id, n.created_at, nb.name as note_book_name
        FROM notes n
        LEFT JOIN note_books nb ON n.note_book_id = nb.id
        WHERE n.title ILIKE ${`%${search}%`}
        ORDER BY n.created_at DESC
      `;
      return NextResponse.json({ success: true, notes });
    } else if (noteBookId) {
      const notes = await sql`
        SELECT n.id, n.title, n.slug, n.note_book_id, n.created_at, nb.name as note_book_name
        FROM notes n
        LEFT JOIN note_books nb ON n.note_book_id = nb.id
        WHERE n.note_book_id = ${parseInt(noteBookId)}
        ORDER BY n.created_at DESC
      `;
      return NextResponse.json({ success: true, notes });
    } else {
      const notes = await sql`
        SELECT n.id, n.title, n.slug, n.note_book_id, n.created_at, nb.name as note_book_name
        FROM notes n
        LEFT JOIN note_books nb ON n.note_book_id = nb.id
        ORDER BY n.created_at DESC
      `;
      return NextResponse.json({ success: true, notes });
    }
  } catch (error) {
    console.error('GET notes error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notes', notes: [] },
      { status: 500 }
    );
  }
}

// 创建笔记
export async function POST(request: Request) {
  try {
    const { title, content, slug, note_book_id } = await request.json();

    if (!title || !content || !slug) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 如果没有指定笔记本，使用默认笔记本
    const targetNoteBook = note_book_id ? parseInt(note_book_id) : 1;

    const result = await sql`
      INSERT INTO notes (title, content, slug, note_book_id)
      VALUES (${title}, ${content}, ${slug}, ${targetNoteBook})
      RETURNING id, title, slug, note_book_id, created_at
    `;

    // 记录创建笔记活动
    await sql`
      INSERT INTO activities (type, action, item_id, item_title, item_slug)
      VALUES ('note', 'create', ${result[0].id}, ${title}, ${slug})
    `;

    return NextResponse.json({ success: true, note: result[0] });
  } catch (error) {
    console.error('Create note error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
