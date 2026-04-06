import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// 强制使用 Node.js runtime
export const runtime = 'nodejs';

export async function GET() {
  try {
    const albums = await sql`
      SELECT id, name, is_default, created_at FROM photo_albums
      ORDER BY is_default DESC, created_at DESC
    `;

    return NextResponse.json({ success: true, albums });
  } catch (error) {
    console.error('GET albums error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch albums', albums: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Create album request body:', body);
    const { name, isDefault } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Album name is required' },
        { status: 400 }
      );
    }

    // 如果设置为默认图集，先将其他图集设置为非默认
    if (isDefault === true) {
      console.log('Setting other albums to non-default');
      await sql`UPDATE photo_albums SET is_default = FALSE`;
    }

    console.log('Inserting new album:', { name, isDefault: isDefault === true });
    const result = await sql`
      INSERT INTO photo_albums (name, is_default)
      VALUES (${name}, ${isDefault === true})
      RETURNING id, name, is_default, created_at
    `;

    console.log('Create album result:', result);
    return NextResponse.json({ success: true, album: result[0] });
  } catch (error) {
    console.error('Create album error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create album: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, isDefault } = await request.json();

    if (!id || !name) {
      return NextResponse.json(
        { success: false, error: 'Album id and name are required' },
        { status: 400 }
      );
    }

    // 如果设置为默认图集，先将其他图集设置为非默认
    if (isDefault === true) {
      await sql`UPDATE photo_albums SET is_default = FALSE`;
    }

    const result = await sql`
      UPDATE photo_albums
      SET name = ${name}, is_default = ${isDefault === true}
      WHERE id = ${id}
      RETURNING id, name, is_default, created_at
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Album not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, album: result[0] });
  } catch (error) {
    console.error('Update album error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update album' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Album id is required' },
        { status: 400 }
      );
    }

    // 检查是否是默认图集
    const album = await sql`SELECT is_default FROM photo_albums WHERE id = ${parseInt(id)}`;
    if (album.length > 0 && album[0].is_default) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete default album' },
        { status: 400 }
      );
    }

    // 将该图集的照片移到默认图集
    await sql`UPDATE photos SET album_id = 1 WHERE album_id = ${parseInt(id)}`;

    // 删除图集
    await sql`DELETE FROM photo_albums WHERE id = ${parseInt(id)}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete album error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete album' },
      { status: 500 }
    );
  }
}
