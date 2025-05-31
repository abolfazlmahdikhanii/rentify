import React from "react";
import styles from "./PropertyDialog.module.css";
import Image from "next/image";
const PropertyDialog = ({ isOpen, onClose, selectedProperty }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && <div className={styles.overlay} onClick={onClose} />}

      {/* Sidebar */}
      <div className={`${styles.sidebar}  ${isOpen ? styles.open : ""}`}>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>جزییات ملک</h2>
            <button className={styles.closeButton} onClick={onClose}>
              ✕
            </button>
          </div>

          <div className={styles.sidebarBody}>
            <div className={styles.modalContent}>
              <div className={styles.propertyImageContainer}>
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt={selectedProperty?.address}
                  width={320}
                  height={300}
                  className={styles.modalPropertyImage}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  //   onClick={handleApprove}
                  className={styles.approveButton}
                >
                  تایید کردن
                </button>
                <button
                  //   onClick={handleReject}
                  className={styles.rejectButton}
                >
                  رد کردن
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDialog;
