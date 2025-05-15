import React from "react";
import styles from "../../../styles/RegisterStep.module.css";

const StepContent = ({
  children,
  title,
  event,
  step,
  setStep,
  prevEvent,
  onSubmit,
  isDisable,
  isLoading,
}) => {
  return (
    <div className={styles.formSection}>
      <div className={styles.formContent}>
        <h2 className={styles.formTitle}>
          {!title ? "لطفا اطلاعات زیر را کامل کنید" : title}
        </h2>

        {children}
      </div>

      <div className={styles.btnRow}>
        <button
          className={`btn btn-primary ${styles.btnContinue}`}
          type={step === 6 ? "submit" : "button"}
          onClick={(e) => (step !== 6 ? event(step) : null)}
          disabled={isDisable||isLoading}
        >
          {step === 6 ? (
            <>
              {!isLoading ? <span>ثبت نهایی</span> : <div className="loader"></div>}
            </>
          ) : (
            <>
              <span>ادامه</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  d="M7.5 13H17v-2H7.5z"
                  clipRule="evenodd"
                ></path>
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  d="m8.414 12 2.793-2.793-1.414-1.414-3.5 3.5a1 1 0 0 0 0 1.414l3.5 3.5 1.414-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </>
          )}
        </button>
        {step > 1 ? (
          <button className={`btn  ${styles.btnBack}`} onClick={prevEvent}>
            <span>مرحله قبل</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="24"
              fill="none"
              viewBox="0 0 25 24"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M17 13H7.5v-2H17z"
                clipRule="evenodd"
              ></path>
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="m16.086 12-2.793-2.793 1.414-1.414 3.5 3.5a1 1 0 0 1 0 1.414l-3.5 3.5-1.414-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default StepContent;
