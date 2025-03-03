import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function PaymentsPopModal({ isOpen, onClose, onPaymentsAdded }) {
  const [amount, setAmount] = useState("");
  const [payments_note, setPaymentsNote] = useState("");
  const [due_date, setDueDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, payments_note, due_date, userId: 1 }),
    });

    if (response.ok) {
      const updatedPayments = await fetch("/api/payments").then((res) => res.json());
      onPaymentsAdded(updatedPayments);
      onClose();
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

        {/* Title */}
        <h2 className="text-2xl font-semibold">Add Payments</h2>

        {/* Due Date Picker */}
        <label className="block mt-2 text-gray-300">Due Date:</label>
        <input
          type="date"
          value={due_date}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 bg-white text-gray-800 rounded-md"
        />

        {/* Amount Input */}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : "")}
          placeholder="₱0.00"
          className="mt-4 text-5xl font-bold text-center text-gray-800 w-full bg-white p-2 rounded-md"
        />

        {/* Note Input */}
        <input
          type="text"
          value={payments_note}
          onChange={(e) => setPaymentsNote(e.target.value)}
          placeholder="Add note..."
          className="w-full mt-4 p-2 bg-white text-gray-800 rounded-md"
        />

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
