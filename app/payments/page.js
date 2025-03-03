"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Calendar from "@/components/Calendar";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import PaymentsPopModal from "@/components/PaymentsPopModal";

export default function Payments() {
  const [daySet, setDaySet] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [payments, setPayments] = useState([]);
  const [editingPayments, setEditingPayments] = useState(null); // Track the expense being edited
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session && session.user.id) {
      fetchPayments();
    }
  }, [session]);

  const fetchPayments = async () => {
    const response = await fetch("/api/payments");
    const data = await response.json();
    if (!data.error) setPayments(data);
  };

  const handlePaymentsAdded = (updatedPayments) => {
    setPayments(updatedPayments); // Update the expenses state
  };

  const handlePrevSet = () => {
    setDaySet((prev) => Math.max(prev - 1, 0));
  };

  const handleNextSet = () => {
    setDaySet((prev) => prev + 1);
  };

  const handleDelete = async (id) => {
    const response = await fetch(`/api/payments/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setPayments(payments.filter((payment) => payment.id !== id)); // Remove the deleted expense
    } else {
      console.log("Error deleting payment");
    }
  };

  const handleEdit = (payment) => {
    const date = new Date(payment.due_date);

    // Get the local date in YYYY-MM-DD format
    const localDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    setEditingPayments(payment.id);
    setUpdatedData({
      amount: payment.amount,
      payments_note: payment.payments_note,
      due_date: localDate,
    });
  };

  const handleUpdate = async (id) => {
    const response = await fetch(`/api/payments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      setPayments(
        payments.map((payment) =>
          payment.id === id ? { ...payment, ...updatedData } : payment,
        ),
      );
      setEditingPayments(null); // Reset editing state
    } else {
      console.log("Error updating payment");
    }
  };

  if (status === "loading")
    return <p className="p-6 text-blue-500">Loading...</p>;
  if (!session) return null;

  return (
    <div className="h-screen w-screen border border-red-500 flex flex-row">
      {/* Left Panel */}
      <div className="h-full w-1/5 border border-red-400 mr-6"></div>

      {/* Right Container */}
      <div className="h-full w-4/5 border border-red-500">
        {/* Calendar Container */}
        <div className="relative w-full h-1/4 bg-green-900 my-6 rounded-2xl">
          {/* Previous Button */}
          <button
            onClick={handlePrevSet}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-2xl opacity-50 hover:opacity-100 transition-opacity"
          >
            &lt;
          </button>

          {/* Calendar Component */}
          <Calendar onPrev={handlePrevSet} onNext={handleNextSet} />

          {/* Next Button */}
          <button
            onClick={handleNextSet}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-2xl opacity-50 hover:opacity-100 transition-opacity"
          >
            &gt;
          </button>
        </div>

        {/* Payment Details & Payment History */}
        <div className="w-full h-2/3 border border-green-500 mt-3 flex flex-row">
          {/* Payment Details */}
          <div className="h-full w-1/2 border border-red-500 relative">
            {payments.length > 0 ? (
              payments.map((payment) => {
                // Convert date to "March 03, 2025" format
                const formattedDate = new Date(
                  payment.due_date,
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                });

                return (
                  <div
                    key={payment.id}
                    className={`p-4 text-white rounded-lg mb-3 bg-green-700`}
                  >
                    {editingPayments === payment.id ? (
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
                          value={updatedData.payments_note}
                          onChange={(e) =>
                            setUpdatedData({
                              ...updatedData,
                              payments_note: e.target.value,
                            })
                          }
                          className="w-full p-1 mt-1 text-black rounded"
                        />
                        <input
                          type="date"
                          value={updatedData.due_date}
                          onChange={(e) =>
                            setUpdatedData({
                              ...updatedData,
                              due_date: e.target.value,
                            })
                          }
                          className="w-full p-1 mt-1 text-black rounded"
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            onClick={() => handleUpdate(payment.id)}
                            className="p-1 bg-blue-500 text-white rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingPayments(null)}
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
                          <span className="font-bold">
                            ₱{Number(payment.amount).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm mt-1">
                          Note: {payment.payments_note}
                        </p>
                        <p className="text-sm mt-1">
                          Due Date: {formattedDate}
                        </p>
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            onClick={() => handleEdit(payment)}
                            className="p-1 bg-white rounded-full hover:bg-gray-200 transition"
                          >
                            <PencilIcon className="w-4 h-4 text-blue-500" />
                          </button>
                          <button
                            onClick={() => handleDelete(payment.id)}
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
              <p className="text-gray-500 text-center">No payments recorded.</p>
            )}
            {/* Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-12 h-12 bg-green-900 rounded-full flex items-center justify-center shadow-md hover:bg-green-700 transition absolute bottom-4 right-4"
            >
              <PlusIcon className="w-6 h-6 text-green-500 hover:text-white" />
            </button>
          </div>

          {/* Payment History */}
          <div className="h-full w-1/2 border border-red-500">
            {payments.length > 0 ? (
              payments
                .sort((a, b) => b.amount - a.amount) // Sort from highest to lowest
                .map((payment) => (
                  <div
                    key={payment.id}
                    className="flex justify-between items-center p-3 mb-3 bg-green-700 text-white rounded-lg"
                  >
                    {/* Note on the left */}
                    <span className="text-sm">{payment.payments_note}</span>

                    {/* Amount on the right */}
                    <span className="font-bold">
                      ₱{Number(payment.amount).toFixed(2)}
                    </span>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 text-center">
                No payment history available.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <PaymentsPopModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPaymentsAdded={handlePaymentsAdded} // Pass the callback function
      />
    </div>
  );
}
