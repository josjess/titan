import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate credentials - replace with your actual auth logic
    const isValid = await authenticateUser(email, password);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Get user from DB - replace with your actual user lookup
    const user: User = await getUserByEmail(email);

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    const response = NextResponse.json(
      { user: { id: user.id, name: user.name, email: user.email, role: user.role } },
      { status: 200 }
    );

    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Set client-readable cookie
    response.cookies.set({
      name: 'is_authenticated',
      value: 'true',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mock functions - replace with your actual implementations
async function authenticateUser(email: string, password: string): Promise<boolean> {
  // Implement your actual authentication logic
  return true;
}

async function getUserByEmail(email: string): Promise<User> {
  // Implement your actual user lookup
  return {
    id: '123',
    email: email,
    name: 'Test User',
    role: 'user'
  };
}