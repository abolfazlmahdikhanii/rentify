import React from "react";
import styles from "./DeleteModal.module.css";
import { Info, TriangleAlert } from "lucide-react";
const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  question,
  property,
  type = "delete",
}) => {
  return (
    <>
      <div
        className={styles.dialogOverlay}
        style={{ display: isOpen ? "block" : "none" }}
        role="presentation"
      >
        <div
          className={styles.dialogContainer}
          role="dialog"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          aria-modal="true"
        >
          <div
            className={
              type === "delete" ? styles.dialogHeader : styles.dialogHeader2
            }
          >
            {type === "delete" ? (
              <div className={styles.warningIcon} aria-hidden="true">
                <TriangleAlert />
              </div>
            ) : (
              <div className={styles.infoIcon} aria-hidden="true">
                <Info />
              </div>
            )}
            <h2
              id="dialog-title"
              className={
                type === "delete" ? styles.dialogTitle : styles.dialogTitle2
              }
            >
              {title}
            </h2>
          </div>

          <div className={styles.dialogBody}>
            <p id="dialog-description" className={styles.deleteQuestion}>
              {question}
            </p>

            {property && (
              <div className={styles.propertyInfo}>
                <div className={styles.propertyTitle}>{property.title}</div>
                <div className={styles.propertyAddress}>
                  {property.location}
                </div>
              </div>
            )}
            {type === "delete" ? (
              <div className={styles.buttonGroup}>
                <button
                  className={`${styles.btn} ${styles.btnDelete}`}
                  onClick={onConfirm}
                  // disabled={loading}
                  // aria-describedby={loading ? "loading-description" : undefined}
                >
                  {/* {loading && (
                  <span
                    className={styles.loadingSpinner}
                    aria-hidden="true"
                  ></span>
                )} */}
                  حذف
                  {/* {loading ? loadingText : confirmText} */}
                </button>
                <button
                  className={`${styles.btn} ${styles.btnCancel}`}
                  onClick={onClose}
                  // disabled={loading}
                >
                  لغو
                </button>
              </div>
            ) : (
              <div className={styles.buttonGroup}>
                <button
                  className={`${styles.btn} ${styles.btnModify}`}
                  onClick={onConfirm}
                  // disabled={loading}
                  // aria-describedby={loading ? "loading-description" : undefined}
                >
                  {/* {loading && (
                  <span
                    className={styles.loadingSpinner}
                    aria-hidden="true"
                  ></span>
                )} */}
                  تغییر
                  {/* {loading ? loadingText : confirmText} */}
                </button>
                <button
                  className={`${styles.btn} ${styles.btnCancel}`}
                  onClick={onClose}
                  // disabled={loading}
                >
                  لغو
                </button>
              </div>
            )}

            {/* {loading && (
              <div id="loading-description" className="sr-only">
                در حال پردازش درخواست، لطفاً صبر کنید
              </div>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
