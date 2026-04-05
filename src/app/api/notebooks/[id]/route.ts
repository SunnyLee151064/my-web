import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// 获取单个笔记本
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const notebooks = await sql`
      SELECT id, name, is_default, created_at FROM notebooks WHERE id = ${parseInt(id)}
    `;

    if (notebooks.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Notebook not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, notebook: notebooks[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notebook' },
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
        { success: false, error: 'Notebook name is required' },
        { status: 400 }
      );
    }

    // 不能修改默认笔记本
    const existing = await sql`SELECT is_default FROM notebooks WHERE id = ${parseInt(id)}`;
    if (existing.length > 0 && existing[0].is_default) {
      return NextResponse.json(
        { success: false, error: 'Cannot modify default notebook' },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE notebooks SET name = ${name} WHERE id = ${parseInt(id)}
      RETURNING id, name, is_default
    `;

    return NextResponse.json({ success: true, notebook: result[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update notebook' },
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
    const existing = await sql`SELECT is_default FROM notebooks WHERE id = ${idNum}`;
    if (existing.length > 0 && existing[0].is_default) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete default notebook' },
        { status: 400 }
      );
    }

    // 将该笔记本下的博客移到默认笔记本
    await sql`
      UPDATE posts SET notebook_id = (
        SELECT id FROM notebooks WHERE is_default = TRUE LIMIT 1
      ) WHERE notebook_id = ${idNum}
    `;

    await sql`DELETE FROM notebooks WHERE id = ${idNum}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete notebook' },
      { status: 500 }
    );
  }
}