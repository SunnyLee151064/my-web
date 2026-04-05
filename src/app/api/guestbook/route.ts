import { NextResponse } from 'next/server';
import { sql, initDatabase } from '@/lib/db';

export async function GET(request: Request) {
  try {
    await initDatabase();
    
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get('includeAll') === 'true';
    
    let messages;
    if (includeAll) {
      // 获取所有留言（用于 admin 审核）
      messages = await sql`
        SELECT * FROM guestbook
        ORDER BY created_at DESC
      `;
    } else {
      // 只获取已审核的留言（用于访客查看）
      messages = await sql`
        SELECT * FROM guestbook
        WHERE is_approved = TRUE
        ORDER BY created_at DESC
        LIMIT 20
      `;
    }

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('GET guestbook error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch guestbook messages', messages: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await initDatabase();
    
    const { name, message } = await request.json();

    if (!name || !message) {
      return NextResponse.json(
        { success: false, error: 'Name and message are required' },
        { status: 400 }
      );
    }

    if (name.length > 255) {
      return NextResponse.json(
        { success: false, error: 'Name is too long' },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Message is too long' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO guestbook (name, message, is_approved)
      VALUES (${name}, ${message}, FALSE)
      RETURNING id, name, message, created_at, is_approved
    `;

    return NextResponse.json({ success: true, message: result[0] });
  } catch (error) {
    console.error('Create guestbook message error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await initDatabase();
    
    const { id, is_approved } = await request.json();

    if (!id || is_approved === undefined) {
      return NextResponse.json(
        { success: false, error: 'id and is_approved are required' },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE guestbook
      SET is_approved = ${is_approved}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: result[0] });
  } catch (error) {
    console.error('Update guestbook message error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await initDatabase();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'id is required' },
        { status: 400 }
      );
    }

    const result = await sql`
      DELETE FROM guestbook
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete guestbook message error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
