export async function GET(req) {
    const authToken = req.headers.get("cookie")?.split("authToken=")[1];
  
    if (!authToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
  
    const response = await fetch('{process.env.NEXT_PUBLIC_FINERACT_API}/users/me', {
      headers: {
        Authorization: authToken,
      },
    });
  
    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch user data" }), { status: 500 });
    }
  
    const user = await response.json();
    return new Response(JSON.stringify(user), { status: 200 });
  }
  