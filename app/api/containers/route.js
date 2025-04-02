import pool from "@/lib/db";
import { NextResponse } from "next/server";

// Create Container
export async function POST(req) {
  try {
    const { container, loading_date, arrival_date, consignee, invoice_id, quantity } = await req.json();

    // Convert empty string to NULL for invoice_id
    const cleanInvoiceId = invoice_id === "" ? null : invoice_id;
    
    // Convert empty string to NULL for consignee (optional)
    const cleanConsignee = consignee === "" ? null : consignee;
    
    // Ensure quantity is a proper integer
    const cleanQuantity = quantity ? parseInt(quantity) : 0;

    const result = await pool.query(
      `INSERT INTO containers 
       (container, loading_date, arrival_date, consignee, invoice_id, quantity) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [
        container, 
        loading_date, 
        arrival_date, 
        cleanConsignee, 
        cleanInvoiceId, 
        cleanQuantity
      ]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to create container" }, 
      { status: 500 }
    );
  }
}
// Get All Containers
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM containers ORDER BY arrival_date DESC");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch containers" }, { status: 500 });
  }
}
