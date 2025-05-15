import React, { useState } from 'react'
import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import styles from "./DatePicker.module.css"
const DatePicker = ({selectedDate,onSelectedDate}) => {
    // const [date, setDate] = useState(null);
  const customWeekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
  return (
    <div dir="rtl" className={styles.calendarContainer}>
        <Calendar
          className={styles.customCalendar}
          
          value={selectedDate}
          onChange={(dateObject) => {
            // Convert the date object to the format you want
            const formattedDate = dateObject?.format?.("YYYY/MM/DD");
            onSelectedDate(formattedDate);
          }}
          calendar={persian}
          locale={persian_fa}
          format="YYYY/MM/DD"
          onlyCalendar
          weekDays={customWeekDays}
          minDate={new Date()}

          shadow={false}
          renderButton={(direction, handleClick) => (
            <button onClick={handleClick} className={styles.btnArrow}>
              {direction !== "right" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="25"
                  fill="none"
                  viewBox="0 0 24 25"
                >
                  <path
                    fill="#0C0C0C"
                    fillRule="evenodd"
                    d="M12.336 12.5 9.543 9.707l1.414-1.414 3.5 3.5a1 1 0 0 1 0 1.414l-3.5 3.5-1.414-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="25"
                  fill="none"
                  viewBox="0 0 24 25"
                >
                  <path
                    fill="#0C0C0C"
                    fillRule="evenodd"
                    d="m11.664 12.5 2.793-2.793-1.414-1.414-3.5 3.5a1 1 0 0 0 0 1.414l3.5 3.5 1.414-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </button>
          )}
        />
      </div>
  )
}

export default DatePicker