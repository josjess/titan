import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Check if user exists
    const existingUser = await pool('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rowCount > 0) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    await pool('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, hashedPassword]);

    return NextResponse.json({ message: 'User registered successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
