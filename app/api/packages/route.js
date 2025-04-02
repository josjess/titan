import pool from "@/lib/db";
import { NextResponse } from "next/server";

// Create packages
export async function POST(req) {
  try {
    const {
      date_received, tracking_no, num_packages , name, remarks
    } = await req.json();

    const result = await pool.query(
      `INSERT INTO packages (date_received, tracking_no, num_packages , name, remarks) 
      VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [date_received, tracking_no, num_packages , name, remarks]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create packages" }, { status: 500 });
  }
}

// Get All packages
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM packages ORDER BY date_received DESC");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}
