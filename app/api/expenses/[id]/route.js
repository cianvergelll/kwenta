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
      const { amount, category, expense_note, current_date } = data;
  
      // Ensure all required fields are provided
      if (!amount || !category || !expense_note || !current_date) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
      }
  
      // Update the expense in the database
      await db.query(
        "UPDATE expenses SET amount=?, category=?, expense_note=?, `current_date`=? WHERE id=?",
        [amount, category, expense_note, current_date, id]
      );
  
      return NextResponse.json({ message: "Expense updated successfully" }, { status: 200 });
  
    } catch (error) {
      return NextResponse.json({ message: "Error updating expense", error: error.message }, { status: 500 });
    }
  }

export async function DELETE(request, { params }) {
    try {
      const { id } = await Promise.resolve(params);
  
      await db.query("DELETE FROM expenses WHERE id=?", [id]);
  
      return NextResponse.json({ message: "Expense deleted successfully" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Error deleting expense", error: error.message }, { status: 500 });
    }
  }