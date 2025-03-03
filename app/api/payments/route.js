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
    const [payments] = await db.query("SELECT * FROM payments WHERE user_id = ?", [session.user.id]);
    return NextResponse.json(payments);

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

    const { amount, payments_note, due_date } = await req.json();

    await db.query(
      "INSERT INTO payments (user_id, amount, payments_note, `due_date`) VALUES (?, ?, ?, ?)",
      [session.user.id, amount , payments_note, due_date]);

    return NextResponse.json({ message: "payment added successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error adding payment", message: error.message }, { status: 500 });
  }
}
