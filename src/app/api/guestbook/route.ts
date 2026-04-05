import { NextResponse } from 'next/server';
import { sql, initDatabase } from '@/lib/db';

export async function GET() {
  try {
    await initDatabase();
    
    const messages = await sql`
      SELECT * FROM guestbook
      ORDER BY created_at DESC
      LIMIT 20
    `;

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
      INSERT INTO guestbook (name, message)
      VALUES (${name}, ${message})
      RETURNING id, name, message, created_at
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
