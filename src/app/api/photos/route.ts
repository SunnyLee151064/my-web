import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { put } from '@vercel/blob';

// 强制使用 Node.js runtime
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    
    const url = new URL(request.url);
    const albumId = url.searchParams.get('album_id');

    let photos;
    if (albumId) {
      photos = await sql`
        SELECT id, url, blob_id, description, created_at FROM photos
        WHERE album_id = ${parseInt(albumId)}
        ORDER BY created_at DESC
      `;
    } else {
      photos = await sql`
        SELECT id, url, blob_id, description, created_at FROM photos
        ORDER BY created_at DESC
      `;
    }

    // 获取所有图集
    const albums = await sql`
      SELECT id, name, is_default FROM photo_albums
      ORDER BY is_default DESC, created_at DESC
    `;

    return NextResponse.json({ success: true, photos, albums });
  } catch (error) {
    console.error('GET photos error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch photos', photos: [], albums: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('Upload request received');
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;
    const albumId = formData.get('album_id') as string;

    console.log('Form data received:', { file: file?.name, description, albumId });

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // 上传到 Vercel Blob
    console.log('Uploading to Vercel Blob:', file.name);
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    });
    console.log('Blob upload successful:', blob.url);

    // 保存到数据库
    console.log('Saving to database:', { url: blob.url, blobId: blob.pathname, description, albumId: albumId || 1 });
    const result = await sql`
      INSERT INTO photos (url, blob_id, description, album_id)
      VALUES (${blob.url}, ${blob.pathname}, ${description || null}, ${parseInt(albumId) || 1})
      RETURNING id, url, created_at
    `;
    console.log('Database save successful:', result[0]);

    // 记录上传图片活动
    await sql`
      INSERT INTO activities (type, action, item_id, item_title, item_url)
      VALUES ('photo', 'upload', ${result[0].id}, ${description || '新图片'}, ${blob.url})
    `;

    return NextResponse.json({ success: true, photo: result[0] });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}