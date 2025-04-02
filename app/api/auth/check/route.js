import { cookies } from "next/headers";

export async function GET() {
  const token = cookies().get("auth_token");

  if (!token) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ authenticated: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
