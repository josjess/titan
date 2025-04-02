import pool from "@/lib/db";
import { NextResponse } from "next/server";

// Delete user by ID
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "user deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
