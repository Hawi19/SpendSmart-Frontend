import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./ExpenseCalendar.module.css";

const ExpenseCalendar = ({ onDateSelect }) => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setDate(newDate);
    const startOfWeek = new Date(newDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
    const endOfWeek = new Date(startOfWeek); // Create a new date object for the end of the week
    endOfWeek.setDate(endOfWeek.getDate() + 6); // Saturday
    onDateSelect({ startOfWeek, endOfWeek }); // Pass both dates
  };

  const resetDate = () => {
    const today = new Date();
    setDate(today);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    onDateSelect({ startOfWeek, endOfWeek }); // Reset selection
  };

  return (
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
  );
};

export default ExpenseCalendar;
