import pool from "@/lib/db";
import { NextResponse } from "next/server";

// Create Invoice
export async function POST(req) {
  try {
    const {
      shippingCompany, shippingOption, invoiceNumber, invoiceDate, clientName,
      phoneNumber, address, package: packageName, datePicked, dateDispatched,
      total, paid, balance, deliveries, receiverName, receiverContact,
      referenceNumber, remarks
    } = await req.json();

    const result = await pool.query(
      `INSERT INTO invoice (shipping_company, shipping_option, invoice_number, invoice_date, client_name,
      phone_number, address, package, date_picked, date_dispatched, total, paid, balance, deliveries,
      receiver_name, receiver_contact, reference_number, remarks) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *`,
      [shippingCompany, shippingOption, invoiceNumber, invoiceDate, clientName, phoneNumber,
       address, packageName, datePicked, dateDispatched, total, paid, balance, deliveries,
       receiverName, receiverContact, referenceNumber, remarks]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}

// Get All invoice
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM invoice ORDER BY invoice_date DESC");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 });
  }
}
