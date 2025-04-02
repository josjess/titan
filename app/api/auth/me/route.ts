import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
  role: string;
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Authorization token missing" },
      { status: 401 }
    );
  }

  if (!process.env.JWT_SECRET) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as UserPayload;
    return NextResponse.json({
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}