import pool from "@/lib/db";
import { NextResponse } from "next/server";

// Create Customer
export async function POST(req) {
  try {
    const { customer_name, mobile_number, location } = await req.json();

    const result = await pool.query(
      `INSERT INTO customers (customer_name, mobile_number, location) 
      VALUES ($1, $2, $3) RETURNING *`,
      [customer_name, mobile_number, location]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}

// Get All Customers
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM customers ORDER BY customer_name ASC");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
