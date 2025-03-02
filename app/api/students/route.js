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
    const [students] = await db.query("SELECT * FROM students WHERE user_id = ?", [session.user.id]);
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: "Database Error", message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, degree_program, email, contact_number, contact_person, age, status } = await req.json();

    await db.query(
      "INSERT INTO students (user_id, name, degree_program, email, contact_number, contact_person, age, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [session.user.id, name, degree_program, email, contact_number, contact_person, age, status]
    );

    return NextResponse.json({ message: "Student added successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error adding student", message: error.message }, { status: 500 });
  }
}
