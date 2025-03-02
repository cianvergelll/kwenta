import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function ExpensePopModal({ isOpen, onClose, onExpenseAdded }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expense_note, setExpenseNote] = useState("");
  const [current_date, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  setCurrentDate(formattedDate);
  }, []);

  // Handle input changes correctly
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleExpenseNoteChange = (e) => setExpenseNote(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, category, expense_note, current_date, userId: 1 }),
    });

    if (response.ok) {
      const updatedExpenses = await fetch("/api/expenses").then((res) => res.json());
      onExpenseAdded(updatedExpenses); // Update UI with new data
      onClose(); // Close modal after submission
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gradient-to-r from-green-700 to-green-900 text-white p-6 rounded-lg shadow-lg w-96 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-gray-300"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Title & Date */}
        <h2 className="text-2xl font-semibold">Add Expense</h2>
        <p className="text-sm text-gray-300">{current_date}</p>

        {/* Amount Input */}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : "")}
          placeholder="₱0.00"
          className="mt-4 text-5xl font-bold text-center text-gray-800 w-full bg-white p-2 rounded-md"
        />

        {/* Form Inputs */}
        <div className="mt-6 flex space-x-2">
          {/* Categories Dropdown */}
          <select
            onChange={handleCategoryChange}
            className="w-1/2 p-2 bg-white text-gray-800 rounded-md"
            value={category}
          >
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Shopping">Shopping</option>
            <option value="Utilities">Utilities</option>
          </select>

          {/* Note Input */}
          <input
            type="text"
            value={expense_note}
            onChange={handleExpenseNoteChange}
            placeholder="Add note..."
            className="w-1/2 p-2 bg-white text-gray-800 rounded-md"
          />
        </div>

        {/* Add Expense Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-black mt-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          Add to Expense
        </button>
      </div>
    </div>
  );
}
