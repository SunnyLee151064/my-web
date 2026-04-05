import { NextResponse } from 'next/server';
import { sql, initDatabase } from '@/lib/db';

// 生成唯一的请求ID，防止重复处理
function generateRequestId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 存储已处理的请求
const processedRequests = new Set<string>();

export async function GET(request: Request) {
  try {
    await initDatabase();
    
    const activities = await sql`
      SELECT * FROM activities
      ORDER BY created_at DESC
      LIMIT 5
    `;

    return NextResponse.json({ success: true, activities });
  } catch (error) {
    console.error('GET activities error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activities', activities: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // 生成请求ID
    const requestId = generateRequestId();
    
    // 检查是否已处理
    if (processedRequests.has(requestId)) {
      return NextResponse.json({ success: false, error: 'Request already processed' });
    }
    
    // 标记为已处理
    processedRequests.add(requestId);
    
    // 清理过期的请求ID（超过5分钟的）
    setTimeout(() => {
      processedRequests.delete(requestId);
    }, 5 * 60 * 1000);
    
    await initDatabase();
    
    const { type, action, item_id, item_title, item_slug, item_url } = await request.json();

    if (!type || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO activities (type, action, item_id, item_title, item_slug, item_url)
      VALUES (${type}, ${action}, ${item_id || null}, ${item_title || null}, ${item_slug || null}, ${item_url || null})
      RETURNING id, type, action, item_id, item_title, item_slug, item_url, created_at
    `;

    return NextResponse.json({ success: true, activity: result[0] });
  } catch (error) {
    console.error('Create activity error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
