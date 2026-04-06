import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { del } from '@vercel/blob';

// 强制使用 Node.js runtime
export const runtime = 'nodejs';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing photo ID' },
        { status: 400 }
      );
    }

    // 获取照片信息
    const photos = await sql`SELECT blob_id, url, description FROM photos WHERE id = ${id}`;

    if (photos.length > 0 && photos[0].blob_id) {
      // 删除 Blob
      try {
        await del(photos[0].blob_id);
      } catch (blobError) {
        console.error('Failed to delete blob:', blobError);
      }
    }

    // 记录删除图片活动
    if (photos.length > 0) {
      await sql`
        INSERT INTO activities (type, action, item_id, item_title, item_url)
        VALUES ('photo', 'delete', ${parseInt(id)}, ${photos[0].description || '图片'}, ${photos[0].url})
      `;
    }

    // 删除数据库记录
    await sql`DELETE FROM photos WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete photo error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}