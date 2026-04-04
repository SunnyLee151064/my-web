import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { put } from '@vercel/blob';

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
    const db = sql();
    const result = await db`
      INSERT INTO photos (url, blob_id, description)
      VALUES (${blob.url}, ${blob.pathname}, ${description || null})
      RETURNING id, url
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