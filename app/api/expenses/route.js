import db from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [expenses] = await db.query("SELECT * FROM expenses WHERE user_id = ?", [session.user.id]);
    return NextResponse.json(expenses);

  } catch (error) {
    return NextResponse.json({ error: "Database Error", message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
        console.log("Unauthorized Access: No session found.");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, category, expense_note, current_date } = await req.json();

    await db.query(
      "INSERT INTO expenses (user_id, amount, category, expense_note, `current_date`) VALUES (?, ?, ?, ?, ?)",
      [session.user.id, amount , category, expense_note, current_date]);

    return NextResponse.json({ message: "Expense added successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error adding expenses", message: error.message }, { status: 500 });
  }
}
