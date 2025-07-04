import { useEffect, useRef } from 'react';

import styles from "./EditProperty.module.css";

const EditModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md', 
  closeOnOutsideClick = true,
  closeOnEsc = true,
  showCloseButton = true
}) => {
  const modalRef = useRef(null);



  if (!isOpen) return null;

  return (
    <div 
      className={styles.modalOverlay}

      role="dialog"
      aria-modal="true"
    >
      <div 
        ref={modalRef}
        className={`${styles.modal} ${styles[size]}`}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          {showCloseButton && (
            <button 
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close modal"
            >
              &times;
            </button>
          )}
        </div>
        <div className={styles.modalContent}>
          {children}
        </div>
      </div>
    </div>
  );
};



export default EditModal;