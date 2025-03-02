"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import ExpensePopModal from "@/components/ExpensePopModal";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);

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
              expenses.map((expense) => (
                <div
                  key={expense.id}
                  className={`p-4 text-white rounded-lg mb-3 ${getCategoryColor(expense.category)}`}
                >
                  <div className="flex justify-between">
                    <span className="font-bold">{expense.category}</span>
                    <span className="font-bold">
                      ₱{Number(expense.amount).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm mt-1">Note: {expense.expense_note}</p>
                </div>
              ))
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
        <div className="w-full h-2/5 border border-red-400"></div>
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
