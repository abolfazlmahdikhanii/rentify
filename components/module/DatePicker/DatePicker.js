import React, { useState, useMemo } from "react";
import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import styles from "./DatePicker.module.css";
import { toEnglish } from "@/helper/helper";

const DatePicker = ({ selectedDate, onSelectedDate, visitTimes }) => {
  const customWeekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

  // All available time slots (10:00 to 21:00)
  const allTimeSlots = [
    "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", 
    "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
  ];

  // Memoize disabled dates to avoid recalculating on every render
  const disabledDates = useMemo(() => {
    if (!visitTimes || visitTimes.length === 0) return [];

    // Group visits by date
    const visitsByDate = {};
    
    visitTimes.forEach((visit) => {
      let visitDate = visit.visit_date;

      // Convert Gregorian to Persian if needed
      if (visitDate.includes("-")) {
        try {
          const gregorianDate = new DateObject(visitDate);
          const persianDate = gregorianDate.convert(persian);
          visitDate = persianDate.format("YYYY/MM/DD");
        } catch (error) {
          console.error("Error converting date:", visitDate, error);
          return;
        }
      }

      // Convert Persian numerals to English
      visitDate = toEnglish(visitDate);

      // Initialize array if not exists
      if (!visitsByDate[visitDate]) {
        visitsByDate[visitDate] = [];
      }

      // Add visit time to the date (handle different time formats)
      let visitTime = visit.visit_time;
      if (visitTime && visitTime.includes(":")) {
        // Extract hour:minute from time (remove seconds if present)
        visitTime = visitTime.substring(0, 5); // "13:00:00" -> "13:00"
        visitsByDate[visitDate].push(visitTime);
      }
    });

    // Check which dates have all time slots booked
    const fullyBookedDates = [];
    
    Object.keys(visitsByDate).forEach(date => {
      const bookedTimes = visitsByDate[date];
      
      // Check if all time slots are booked for this date
      const allSlotsBooked = allTimeSlots.every(slot => 
        bookedTimes.includes(slot)
      );
      
      if (allSlotsBooked) {
        fullyBookedDates.push(date);
      }
    });

    console.log("Visits by date:", visitsByDate);
    console.log("Fully booked dates:", fullyBookedDates);

    return fullyBookedDates;
  }, [visitTimes]);

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
        mapDays={({ date, today, selectedDate }) => {
          const dateString = toEnglish(date.format("YYYY/MM/DD"));
          const isDisabled = disabledDates.includes(dateString);

          if (isDisabled) {
            return {
              disabled: true,
              style: {
                color: "#ccc",
                backgroundColor: "#f5f5f5",
                cursor: "not-allowed",
                pointerEvents: "none",
                opacity: 0.5,
              },
              className: "disabled-date",
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
              },
            };
          }

          // Return normal date configuration
          return {
            disabled: false,
            style: {},
            className: "",
          };
        }}
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
  );
};

export default DatePicker;