import { NextResponse } from 'next/server';
import { sql, initDatabase } from '@/lib/db';

export async function GET() {
  try {
    await initDatabase();
    
    const result = await sql`
      SELECT count FROM visitor_counts WHERE id = 1
    `;

    return NextResponse.json({ 
      success: true, 
      count: result[0]?.count || 0 
    });
  } catch (error) {
    console.error('GET visitor count error:', error);
    // 优雅降级，返回0
    return NextResponse.json({ 
      success: true, 
      count: 0 
    });
  }
}

export async function POST() {
  try {
    await initDatabase();
    
    const result = await sql`
      UPDATE visitor_counts 
      SET count = count + 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
      RETURNING count
    `;

    return NextResponse.json({ 
      success: true, 
      count: result[0]?.count || 1 
    });
  } catch (error) {
    console.error('Increment visitor count error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
