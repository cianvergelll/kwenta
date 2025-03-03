"use client";

import React, { useState } from "react";
import Calendar from "@/components/Calendar";

export default function Payments() {
    const [daySet, setDaySet] = useState(0);

    const handlePrevSet = () => {
        setDaySet((prev) => Math.max(prev - 1, 0));
    };

    const handleNextSet = () => {
        setDaySet((prev) => prev + 1);
    };

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
                    <div className="h-full w-1/2 border border-red-500"></div>

                    {/* Payment History */}
                    <div className="h-full w-1/2 border border-red-500"></div>
                </div>
            </div>
        </div>
    );
}
