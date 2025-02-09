import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./ExpenseCalendar.module.css"; // Import custom CSS module

const ExpenseCalendar = ({ onDateSelect }) => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setDate(newDate);
    onDateSelect(newDate); // Trigger the parent function to filter expenses
  };

  return (
    <div className={`card p-4 ${styles.card}`}>
      <h3 className="text-center">Select a Date</h3>
      <p className={`text-center ${styles.selectedDate}`}>
        Selected Date: {date.toLocaleDateString()}
      </p>
      <Calendar
        onChange={handleDateChange}
        value={date}
        className={`mb-3 ${styles.calendar}`}
      />
    </div>
  );
};

export default ExpenseCalendar;
