import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { put } from '@vercel/blob';

export async function GET() {
  try {
    const photos = await sql`
      SELECT id, url, blob_id, description, created_at FROM photos
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ success: true, photos });
  } catch (error) {
    console.error('GET photos error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch photos', photos: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // 上传到 Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
    });

    // 保存到数据库
    const result = await sql`
      INSERT INTO photos (url, blob_id, description)
      VALUES (${blob.url}, ${blob.pathname}, ${description || null})
      RETURNING id, url, created_at
    `;

    return NextResponse.json({ success: true, photo: result[0] });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload' },
      { status: 500 }
    );
  }
}