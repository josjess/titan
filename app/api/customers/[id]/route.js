import pool from "@/lib/db";
import { NextResponse } from "next/server";

// Delete customer by ID
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const result = await pool.query("DELETE FROM customers WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "customer not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "customer deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
