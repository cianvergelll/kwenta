"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import ExpensePopModal from "@/components/ExpensePopModal";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null); // Track the expense being edited
  const [updatedData, setUpdatedData] = useState({}); // Store updated data for editing

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session && session.user.id) {
      fetchExpenses();
    }
  }, [session]);

  const fetchExpenses = async () => {
    const response = await fetch("/api/expenses");
    const data = await response.json();
    if (!data.error) setExpenses(data);
  };

  const handleExpenseAdded = (updatedExpenses) => {
    setExpenses(updatedExpenses); // Update the expenses state
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Food":
        return "bg-blue-800";
      case "School":
        return "bg-red-800";
      case "Shopping":
        return "bg-gradient-to-r from-yellow-600 to-green-700";
      case "Transportation":
        return "bg-green-800";
      case "Utilities":
        return "bg-purple-800";
      default:
        return "bg-gray-600"; // Default color
    }
  };

  const calculateCategoryTotals = () => {
    const totals = {};

    expenses.forEach((expense) => {
      if (totals[expense.category]) {
        totals[expense.category] += Number(expense.amount);
      } else {
        totals[expense.category] = Number(expense.amount);
      }
    });

    return totals;
  };

  const getSortedCategoryTotals = () => {
    const totals = calculateCategoryTotals();

    const sortedTotals = Object.keys(totals).map((category) => ({
      category,
      total: totals[category],
    }));

    sortedTotals.sort((a, b) => b.total - a.total);

    return sortedTotals;
  };

  const handleDelete = async (id) => {
    const response = await fetch(`/api/expenses/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setExpenses(expenses.filter((expense) => expense.id !== id)); // Remove the deleted expense
    } else {
      console.log("Error deleting expense");
    }
  };

  const handleEdit = (expense) => {
    const date = new Date(expense.current_date);
  
    // Get the local date in YYYY-MM-DD format
    const localDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  
    setEditingExpense(expense.id);
    setUpdatedData({
      amount: expense.amount,
      category: expense.category,
      expense_note: expense.expense_note,
      current_date: localDate, // Now correctly preserves local date
    });
  };

  const handleUpdate = async (id) => {
    const response = await fetch(`/api/expenses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      setExpenses(
        expenses.map((expense) =>
          expense.id === id ? { ...expense, ...updatedData } : expense,
        ),
      );
      setEditingExpense(null); // Reset editing state
    } else {
      console.log("Error updating expense");
    }
  };

  if (status === "loading")
    return <p className="p-6 text-blue-500">Loading...</p>;
  if (!session) return null;

  return (
    <div className="h-screen w-screen border border-red-500 flex flex-row">
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="bg-red-500 text-white px-4 py-2 mt-2"
      >
        Logout
      </button>
      {/* Left Panel */}
      <div className="h-full w-1/5 border border-red-400 mr-6"></div>

      {/* Button & Today's History */}
      <div className="h-full w-1/3 border border-red-400 mr-6 flex flex-col">
        {/* Button */}
        <div className="w-full h-20 my-6 bg-green-500 rounded-3xl flex items-center justify-end px-5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-green-700 transition"
          >
            <PlusIcon className="w-6 h-6 text-green-500 hover:text-white" />
          </button>
        </div>

        {/* Today's History */}
        <div className="w-full h-5/6 border border-red-400 flex flex-col">
          <div className="w-full h-1/4 border border-red-400"></div>

          {/* Display Board */}
          <div className="w-full h-3/4 border border-gray-300 rounded-lg p-4 overflow-y-auto">
            {expenses.length > 0 ? (
              expenses.map((expense) => {
                // Convert date to "March 03, 2025" format
                const formattedDate = new Date(
                  expense.current_date,
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                });

                return (
                  <div
                    key={expense.id}
                    className={`p-4 text-white rounded-lg mb-3 ${getCategoryColor(expense.category)}`}
                  >
                    {editingExpense === expense.id ? (
                      // Editable Inputs
                      <div>
                        <input
                          type="number"
                          value={updatedData.amount}
                          onChange={(e) =>
                            setUpdatedData({
                              ...updatedData,
                              amount: e.target.value,
                            })
                          }
                          className="w-full p-1 text-black rounded"
                        />
                        <input
                          type="text"
                          value={updatedData.expense_note}
                          onChange={(e) =>
                            setUpdatedData({
                              ...updatedData,
                              expense_note: e.target.value,
                            })
                          }
                          className="w-full p-1 mt-1 text-black rounded"
                        />
                        <input
                          type="date"
                          value={updatedData.current_date}
                          onChange={(e) =>
                            setUpdatedData({
                              ...updatedData,
                              current_date: e.target.value,
                            })
                          }
                          className="w-full p-1 mt-1 text-black rounded"
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            onClick={() => handleUpdate(expense.id)}
                            className="p-1 bg-blue-500 text-white rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingExpense(null)}
                            className="p-1 bg-gray-500 text-white rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Normal Display
                      <>
                        <div className="flex justify-between">
                          <span className="font-bold">{expense.category}</span>
                          <span className="font-bold">
                            ₱{Number(expense.amount).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm mt-1">
                          Note: {expense.expense_note}
                        </p>
                        <p className="text-sm mt-1">Date: {formattedDate}</p>
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            onClick={() => handleEdit(expense)}
                            className="p-1 bg-white rounded-full hover:bg-gray-200 transition"
                          >
                            <PencilIcon className="w-4 h-4 text-blue-500" />
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="p-1 bg-white rounded-full hover:bg-gray-200 transition"
                          >
                            <TrashIcon className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center">No expenses recorded.</p>
            )}
          </div>
        </div>
      </div>

      {/* Chart & Expense Summary */}
      <div className="h-full w-1/3 border border-red-400">
        {/* Chart */}
        <div className="w-full h-1/2 border border-red-400 mt-6 mb-10"></div>

        {/* Expense Summary */}
        <div className="w-full h-2/5 border border-red-400 p-4">
          <h3 className="text-lg font-semibold mb-4">Expense Summary</h3>
          <div className="space-y-3">
            {getSortedCategoryTotals().map(({ category, total }) => (
              <div
                key={category}
                className={`p-3 text-white rounded-lg ${getCategoryColor(category)}`}
              >
                <div className="flex justify-between">
                  <span className="font-bold">{category}</span>
                  <span className="font-bold">₱{total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <ExpensePopModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExpenseAdded={handleExpenseAdded} // Pass the callback function
      />
    </div>
  );
}