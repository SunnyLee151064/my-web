import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// 强制使用 Node.js runtime
export const runtime = 'nodejs';

export async function GET() {
  try {
    const result = await sql`
      SELECT count FROM visitor_counts WHERE id = 1
    `;

    return NextResponse.json({
      success: true,
      count: result[0]?.count || 0
    });
  } catch (error) {
    console.error('GET visitor count error:', error);
    return NextResponse.json({
      success: true,
      count: 0
    });
  }
}

export async function POST() {
  try {
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