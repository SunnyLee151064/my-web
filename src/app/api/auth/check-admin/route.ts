import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const users = await sql`SELECT id FROM users WHERE role = 'admin'`;

    return NextResponse.json({
      exists: users.length > 0
    });
  } catch (error) {
    return NextResponse.json(
      { exists: false, error: 'Failed to check admin' },
      { status: 500 }
    );
  }
}