import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./ExpenseCalendar.module.css";

const ExpenseCalendar = ({ onDateSelect }) => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setDate(newDate);
    const startOfWeek = new Date(newDate);
    const dayOfWeek = startOfWeek.getDay(); // 0 = Sunday, 6 = Saturday
    startOfWeek.setDate(startOfWeek.getDate() - ((dayOfWeek + 1) % 7)); // Set to previous Saturday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // Set to Friday
    onDateSelect({ startOfWeek, endOfWeek });
  };

  const resetDate = () => {
    const today = new Date();
    setDate(today);
    const startOfWeek = new Date(today);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - ((dayOfWeek + 1) % 7)); // Set to previous Saturday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // Set to Friday
    onDateSelect({ startOfWeek, endOfWeek });
  };

  useEffect(() => {
    resetDate();
  }, []);

  return (
    <>
      <div className={`card p-4 ${styles.card}`}>
        <h3 className="text-center">Select a Week</h3>
        <p className={`text-center ${styles.selectedDate}`}>
          Selected Week: {date.toLocaleDateString()} -{" "}
          {new Date(
            new Date(date).setDate(date.getDate() + 6)
          ).toLocaleDateString()}
        </p>
        <button className="btn btn-primary mb-3" onClick={resetDate}>
          Reset to Current Week
        </button>
        <Calendar
          onChange={handleDateChange}
          value={date}
          className={`mb-3 ${styles.calendar}`}
        />
      </div>
     
    </>
  );
};

export default ExpenseCalendar;
