import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { del } from '@vercel/blob';

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

    const db = sql();

    // 获取照片信息
    const photos = await db`SELECT blob_id FROM photos WHERE id = ${id}`;

    if (photos.length > 0 && photos[0].blob_id) {
      // 删除 Blob
      try {
        await del(photos[0].blob_id);
      } catch (blobError) {
        console.error('Failed to delete blob:', blobError);
      }
    }

    // 删除数据库记录
    await db`DELETE FROM photos WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete photo error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}