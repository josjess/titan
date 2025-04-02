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

export async function PUT(req, { params }) {
  await dbConnect();

  const { id } = params; // Extract the package ID from URL
  const updatedData = await req.json(); // Get the request body

  try {
    const existingPackage = await Package.findById(id);
    if (!existingPackage) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    // Update fields
    Object.assign(existingPackage, updatedData);
    await existingPackage.save();

    return NextResponse.json({ message: "Package updated successfully", package: existingPackage });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 });
  }
}
