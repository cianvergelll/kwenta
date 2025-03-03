"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";

const Calendar = ({ onPrev, onNext }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daySet, setDaySet] = useState(0);
  const { data: session, status } = useSession();

  const month = currentDate
    .toLocaleString("default", { month: "long" })
    .toUpperCase();
  const year = currentDate.getFullYear();

  const months = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY",
    "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const daysOfMonth = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      i + 1
    );
    return {
      number: i + 1,
      dayName: dayNames[date.getDay()],
    };
  });

  const daySets = [];
  for (let i = 0; i < daysOfMonth.length; i += 7) {
    daySets.push(daysOfMonth.slice(i, i + 7));
  }

  const handleMonthChange = (event) => {
    const newMonth = months.indexOf(event.target.value);
    const newDate = new Date(currentDate.getFullYear(), newMonth, 1);
    setCurrentDate(newDate);
    setDaySet(0);
  };

  const handleYearChange = (event) => {
    const newYear = parseInt(event.target.value);
    const newDate = new Date(newYear, currentDate.getMonth(), 1);
    setCurrentDate(newDate);
    setDaySet(0);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const handlePrevSet = () => {
    setDaySet((prev) => Math.max(prev - 1, 0));
    onPrev && onPrev(); // Trigger parent function if exists
  };

  const handleNextSet = () => {
    setDaySet((prev) => Math.min(prev + 1, daySets.length - 1));
    onNext && onNext(); // Trigger parent function if exists
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Access Denied</div>;
  }

  return (
    <div className="calendar p-6">
      <div className="header mb-0 flex justify-end">
        <div className="p-0 float-right">
          <h6 className="text-white font-sans text-right ml-auto">SCHEDULE</h6>
          <div className="flex items-center gap-4 mb-4">
            <select
              value={month}
              onChange={handleMonthChange}
              className="px-4 py-2 rounded-lg bg-gradient-to-b from-green-900 to-zinc-900 text-white border border-[#006B46] focus:outline-none focus:ring-2 focus:ring-[#00824F]"
            >
              {months.map((m) => (
                <option key={m} value={m} className="bg-[#004830]">
                  {m}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={handleYearChange}
              className="px-4 py-2 rounded-lg bg-gradient-to-b from-green-900 to-zinc-900 text-white border border-[#006B46] focus:outline-none focus:ring-2 focus:ring-[#00824F]"
            >
              {years.map((y) => (
                <option key={y} value={y} className="bg-[#004830]">
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="text-white live-date text-xl font-semibold mb-4">
        <p>Today: {currentDate.toDateString()}</p>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {daySets[daySet]?.map((day) => (
          <button
            key={day.number}
            className="p-2 rounded-lg text-white bg-[#004830] hover:bg-[#006B46] transition-colors duration-200 flex flex-col items-center"
          >
            <span className="text-lg font-medium">{day.number} </span>
            <span className="text-xs mt-1">{day.dayName} </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
