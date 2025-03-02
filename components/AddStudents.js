import { useState } from "react";

export default function AddStudent({ onStudentAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    degree_program: "",
    email: "",
    contact_number: "",
    contact_person: "",
    age: "",
    status: "Ongoing",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, userId: 1 }), // Replace with session user ID
    });

    if (response.ok) {
      const updatedStudents = await fetch("/api/students").then((res) => res.json());
      onStudentAdded(updatedStudents); // Pass updated list instead of one student
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow-lg">
      <h2 className="text-xl font-bold">Add Student</h2>
      <input className="border p-2 w-full mb-2" type="text" name="name" placeholder="Name" onChange={handleChange} />
      <input className="border p-2 w-full mb-2" type="text" name="degree_program" placeholder="Degree Program" onChange={handleChange} />
      <input className="border p-2 w-full mb-2" type="email" name="email" placeholder="Email" onChange={handleChange} />
      <input className="border p-2 w-full mb-2" type="text" name="contact_number" placeholder="Contact Number" onChange={handleChange} />
      <input className="border p-2 w-full mb-2" type="text" name="contact_person" placeholder="Contact Person" onChange={handleChange} />
      <input className="border p-2 w-full mb-2" type="number" name="age" placeholder="Age" onChange={handleChange} />
      <select name="status" className="border p-2 w-full mb-2" onChange={handleChange}>
        <option value="Ongoing">Ongoing</option>
        <option value="Dropped Out">Dropped Out</option>
        <option value="Graduated">Graduated</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Add Student</button>
    </form>
  );
}
