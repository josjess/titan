import { cookies } from "next/headers";

export async function GET() {
  const authToken = cookies().get("auth_token");

  if (!authToken) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ username: "Admin" }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
