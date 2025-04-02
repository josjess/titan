import pool from "@/lib/db";
import { NextResponse } from "next/server";

// Delete invoice by ID
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const result = await pool.query("DELETE FROM invoice WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "invoice deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 });
  }
}
