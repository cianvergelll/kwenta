import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    try {
      // Extract `id` from params
      const { id } = await Promise.resolve(params);
  
      if (!id) {
        return NextResponse.json({ message: "Item ID is required" }, { status: 400 });
      }
  
      // Parse request body
      const data = await request.json();
      const { amount, payments_note, due_date } = data;
  
      // Ensure all required fields are provided
      if (!amount || !payments_note || !due_date) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
      }
  
      // Update the expense in the database
      await db.query(
        "UPDATE payments SET amount=?, payments_note=?, `due_date`=? WHERE id=?",
        [amount, payments_note, due_date, id]
      );
  
      return NextResponse.json({ message: "Payment updated successfully" }, { status: 200 });
  
    } catch (error) {
      return NextResponse.json({ message: "Error updating Payment", error: error.message }, { status: 500 });
    }
  }

export async function DELETE(request, { params }) {
    try {
      const { id } = await Promise.resolve(params);
  
      await db.query("DELETE FROM payments WHERE id=?", [id]);
  
      return NextResponse.json({ message: "Payment deleted successfully" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Error deleting payment", error: error.message }, { status: 500 });
    }
  }