import React, { useState } from "react";
import styles from "./ModalVisitRequest.module.css";
import JDate from "jalali-date";
import DatePicker from "@/components/module/DatePicker/DatePicker";
import ConfirmationModal from "@/components/module/ConfirmationModal/ConfirmationModal";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";
import { toastOption } from "@/helper/helper";

const ModalVisitRequest = ({ onClose, id, approvedTime }) => {
  const [isOpenTime, setIsOpenTime] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [date, setDate] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const timeSlots = [
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];
  const formatDate = (date) => {
    const englishDate = date.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));

    // Split into components and convert to numbers
    const [year, month, day] = englishDate.split("/").map(Number);
    const jdate2 = new JDate(year, month, day);
    const format = jdate2.format(" DD MMMM ,YYYY");

    return format;
  };
  const formatNewDate = (date) => {
    const englishDate = date.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));

    // Split into components and convert to numbers
    const [year, month, day] = englishDate.split("/").map(Number);
    const jdate2 = new JDate(year, month, day);
    return jdate2._d;
  };
  const visitRequestHandler = (e) => {
    e.preventDefault();
    console.log(formatNewDate(date));
    if (!selectedTime || !date) {
      toast.error("لطفا زمان و تاریخ را انتخاب کنید", toastOption);
      return;
    }
    const newVisit = {
      visitTime: selectedTime,
      visitDate: formatNewDate(date),
    };
    fetch(`https://rentify-app.liara.run/api/visits/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify(newVisit),
    })
      .then((res) => {
        console.log(res);
        if (!res.ok) throw Error;
        return res.json();
      })
      .then((res) => {
        console.log(selectedTime);
        console.log(date);
        setIsSuccess(true);

        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 2000);
      })
      .catch((err) => {
        toast.error("خطا در انتخاب بازدید", toastOption);
      });
  };

  const getDisableTime = () => {
    if (!approvedTime || approvedTime.length === 0) return [];

    return approvedTime.map((item) => item.visit_time.slice(0, 5));
  };
  const disabledTimes = getDisableTime();
  console.log(disabledTimes);
  return (
    <>
      <div className="backdrop">
        {!isSuccess ? (
          <div className={styles.modalBox}>
            <section className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <p className={styles.modalHeader__Title}>درخواست بازدید</p>
                <button className={styles.modalHeader__btn} onClick={onClose}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 25"
                  >
                    <path
                      fill="#0C0C0C"
                      fillRule="evenodd"
                      d="m3.293 19.793 16-16 1.414 1.414-16 16z"
                      clipRule="evenodd"
                    ></path>
                    <path
                      fill="#0C0C0C"
                      fillRule="evenodd"
                      d="m20.707 19.793-16-16-1.414 1.414 16 16z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className={styles.modalBody}>
                <DatePicker
                  selectedDate={date}
                  onSelectedDate={setDate}
                  visitTimes={approvedTime}
                />
                {!isOpenTime ? (
                  <div
                    className={styles.modalTime__open}
                    onClick={() => setIsOpenTime(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="27"
                      height="32"
                      fill="none"
                      viewBox="0 0 27 32"
                    >
                      <path
                        fill="#fff"
                        fillRule="evenodd"
                        d="m7.219 16 3.724-3.724-1.886-1.885-4.667 4.666c-.52.521-.52 1.365 0 1.886l4.667 4.667 1.886-1.886z"
                        clipRule="evenodd"
                      ></path>
                      <path
                        fill="#fff"
                        fillRule="evenodd"
                        d="m13.886 16 3.723-3.724-1.885-1.885-4.667 4.666c-.52.521-.52 1.365 0 1.886l4.667 4.667 1.885-1.886z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  <div className={styles.timePicker}>
                    <div className={styles.container}>
                      <h2 className={styles.title}>
                        ساعت بازدید خود را انتخاب کنید
                      </h2>

                      <div className={styles.timeGrid}>
                        {timeSlots.map((time) => {
                          const isDisabled = disabledTimes.includes(time);

                          return (
                            <button
                              key={time}
                              className={`${styles.timeButton} ${
                                selectedTime === time ? styles.selected : ""
                              } ${isDisabled ? styles.disabled : ""}`}
                              onClick={() =>
                                !isDisabled && setSelectedTime(time)
                              }
                              disabled={isDisabled}
                              style={
                                isDisabled
                                  ? {
                                      opacity: 0.5,
                                      cursor: "not-allowed",
                                      backgroundColor: "#f5f5f5",
                                      color: "#ccc",
                                    }
                                  : {}
                              }
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        className={styles.submitButton}
                        onClick={(e) => {
                          if (selectedTime && date) {
                            visitRequestHandler(e);
                          }
                        }}
                        disabled={!date || !selectedTime}
                      >
                        ثبت درخواست بازدید
                      </button>
                    </div>
                    <button
                      className={styles.timePicker__btn}
                      onClick={() => setIsOpenTime(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="27"
                        height="32"
                        fill="none"
                        viewBox="0 0 27 32"
                      >
                        <path
                          fill="#fff"
                          fillRule="evenodd"
                          d="m7.219 16 3.724-3.724-1.886-1.885-4.667 4.666c-.52.521-.52 1.365 0 1.886l4.667 4.667 1.886-1.886z"
                          clipRule="evenodd"
                        ></path>
                        <path
                          fill="#fff"
                          fillRule="evenodd"
                          d="m13.886 16 3.723-3.724-1.885-1.885-4.667 4.666c-.52.521-.52 1.365 0 1.886l4.667 4.667 1.885-1.886z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (
          <ConfirmationModal
            time={selectedTime}
            date={formatDate(date)}
            onClose={() => {
              setIsSuccess(false);
              onClose();
            }}
          />
        )}
      </div>
    </>
  );
};

export default ModalVisitRequest;
