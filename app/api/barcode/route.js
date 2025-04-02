import pool from "@/lib/db";
import { NextResponse } from "next/server";

// Create Barcode
export async function POST(req) {
  try {
    const { ean13_barcode, status = "Active" } = await req.json();

    const result = await pool.query(
      `INSERT INTO barcode (ean13_barcode, status) 
      VALUES ($1, $2) RETURNING *`,
      [ean13_barcode, status]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create barcode" }, { status: 500 });
  }
}

// Get All Barcodes
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM barcode ORDER BY date DESC");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch barcodes" }, { status: 500 });
  }
}
