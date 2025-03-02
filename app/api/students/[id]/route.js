import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    // Ensure params is awaited (if required by your Next.js version)
    const { id } = await Promise.resolve(params);

    if (!id) {
      return NextResponse.json({ message: "Student ID is required" }, { status: 400 });
    }

    const data = await request.json();

    // Ensure all fields have valid values
    const {
      name = "",
      degree_program = "",
      email = "",
      contact_number = "",
      contact_person = "",
      age = "",
      status = ""
    } = data;

    // Prevent updating with empty values
    if (!name || !degree_program || !email || !contact_number || !contact_person || !age || !status) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Update the student in the database
    await db.query(
      "UPDATE students SET name=?, degree_program=?, email=?, contact_number=?, contact_person=?, age=?, status=? WHERE id=?",
      [name, degree_program, email, contact_number, contact_person, age, status, id]
    );

    return NextResponse.json({ message: "Student updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating student", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    // Ensure params is awaited (if required by your Next.js version)
    const { id } = await Promise.resolve(params);

    if (!id) {
      return NextResponse.json({ message: "Student ID is required" }, { status: 400 });
    }

    // Delete the student from the database
    await db.query("DELETE FROM students WHERE id=?", [id]);

    return NextResponse.json({ message: "Student deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting student", error: error.message }, { status: 500 });
  }
}