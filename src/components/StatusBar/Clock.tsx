"use client";

import { useState, useEffect } from "react";
import { useWmStore } from "@/store/useWmStore";
import { CalendarPopup } from "./CalendarPopup";

export function Clock() {
  const [now, setNow] = useState(new Date());
  const calendarOpen = useWmStore((s) => s.calendarOpen);
  const toggleCalendar = useWmStore((s) => s.toggleCalendar);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const day = days[now.getDay()];
  const month = months[now.getMonth()];
  const date = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;

  return (
    <div className="relative">
      <button
        id="clock-toggle"
        onClick={toggleCalendar}
        className="text-[var(--bar-text)] hover:text-[var(--accent)] transition-colors cursor-pointer tracking-wide"
      >
        {day} {month} {date} | {h12}:{minutes} {ampm}
      </button>
      {calendarOpen && <CalendarPopup />}
    </div>
  );
}
