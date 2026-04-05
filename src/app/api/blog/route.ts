import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// 获取博客列表 - 支持搜索和笔记本筛选
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const notebookId = searchParams.get('notebook_id');

    let query = `
      SELECT p.id, p.title, p.slug, p.notebook_id, p.created_at, n.name as notebook_name
      FROM posts p
      LEFT JOIN notebooks n ON p.notebook_id = n.id
    `;

    const conditions = [];
    const params: any[] = [];

    if (search) {
      conditions.push(`p.title ILIKE $${params.length + 1}`);
      params.push(`%${search}%`);
    }

    if (notebookId) {
      conditions.push(`p.notebook_id = $${params.length + 1}`);
      params.push(parseInt(notebookId));
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY p.created_at DESC';

    const posts = await sql(query, ...params);

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('GET posts error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts', posts: [] },
      { status: 500 }
    );
  }
}

// 创建博客
export async function POST(request: Request) {
  try {
    const { title, content, slug, notebook_id } = await request.json();

    if (!title || !content || !slug) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 如果没有指定笔记本，使用默认笔记本
    const targetNotebook = notebook_id || 1;

    const result = await sql`
      INSERT INTO posts (title, content, slug, notebook_id)
      VALUES (${title}, ${content}, ${slug}, ${targetNotebook})
      RETURNING id, title, slug, notebook_id, created_at
    `;

    return NextResponse.json({ success: true, post: result[0] });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}