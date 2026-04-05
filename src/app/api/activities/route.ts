import { NextResponse } from 'next/server';
import { sql, initDatabase } from '@/lib/db';

export async function GET(request: Request) {
  try {
    await initDatabase();
    
    const activities = await sql`
      SELECT * FROM activities
      ORDER BY created_at DESC
      LIMIT 5
    `;

    return NextResponse.json({ success: true, activities });
  } catch (error) {
    console.error('GET activities error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activities', activities: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await initDatabase();
    
    const { type, action, item_id, item_title, item_slug, item_url } = await request.json();

    if (!type || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO activities (type, action, item_id, item_title, item_slug, item_url)
      VALUES (${type}, ${action}, ${item_id || null}, ${item_title || null}, ${item_slug || null}, ${item_url || null})
      RETURNING id, type, action, item_id, item_title, item_slug, item_url, created_at
    `;

    return NextResponse.json({ success: true, activity: result[0] });
  } catch (error) {
    console.error('Create activity error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
