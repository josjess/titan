import { cookies } from "next/headers";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) return Response.json({ error: "Missing URL" }, { status: 400 });

    // ✅ Read HTTP-only cookie
    const cookieStore = await cookies();
const authToken = cookieStore.get("auth_token")?.value;


    if (!authToken) {
      console.error("❌ No auth_token found in cookies");
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Forward request to Fineract API
    const response = await fetch(`${process.env.NEXT_PUBLIC_FINERACT_API}${url}`, {
      method: "GET",
      headers: {
        "Fineract-Platform-TenantId": process.env.NEXT_PUBLIC_FINERACT_TENANT || "default",
        "Authorization": `Basic ${decodeURIComponent(authToken)}`, // Decode and use auth token
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return Response.json({ error: `API Error: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data, { status: 200 });

  } catch (error) {
    console.error("❌ API Proxy Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
