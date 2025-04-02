import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { success: true },
    { status: 200 }
  );

  // Clear auth cookies
  response.cookies.delete('auth_token');
  response.cookies.delete('is_authenticated');

  return response;
}