import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

// **Fetch Users**
export async function GET() {
  try {
    const result = await pool.query("SELECT id, name, email, role FROM users");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("❌ Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// **Add User**
export async function POST(req: Request) {
  try {
    const { name, email, role, password } = await req.json();
    
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, role, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, role, hashedPassword]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

// **Delete User**
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await pool.query("DELETE FROM users WHERE id = $1", [id]);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
