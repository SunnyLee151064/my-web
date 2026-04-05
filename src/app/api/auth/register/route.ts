import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // 检查是否已存在管理员
    const existingAdmin = await sql(`
      SELECT id FROM users WHERE role = 'admin'
    `);

    if (existingAdmin.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Admin already exists' },
        { status: 400 }
      );
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建管理员
    const result = await sql(`
      INSERT INTO users (username, password, role)
      VALUES (${username}, ${hashedPassword}, 'admin')
      RETURNING id, username, role
    `);

    return NextResponse.json({
      success: true,
      user: result[0]
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}