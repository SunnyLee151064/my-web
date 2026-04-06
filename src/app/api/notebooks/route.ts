import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// 强制使用 Node.js runtime 确保与 Neon 的兼容性
export const runtime = 'nodejs';

// 获取所有笔记本
export async function GET() {
  try {
    const notebooks = await sql`
      SELECT id, name, is_default, created_at FROM notebooks
      ORDER BY is_default DESC, created_at DESC
    `;
    return NextResponse.json({ success: true, notebooks });
  } catch (error) {
    console.error('GET notebooks error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notebooks' },
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
        { success: false, error: 'Notebook name is required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO notebooks (name)
      VALUES (${name})
      RETURNING id, name, is_default, created_at
    `;

    return NextResponse.json({ success: true, notebook: result[0] });
  } catch (error) {
    console.error('Create notebook error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create notebook' },
      { status: 500 }
    );
  }
}