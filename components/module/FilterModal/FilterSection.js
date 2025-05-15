import { useState } from "react";
import styles from "./FilerModal.module.css";
function FilterSection({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={styles.filterSection}>
      <button
        className={styles.sectionHeader}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.sectionTitle}>{title}</span>
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              fill="#0C0C0C"
              fillRule="evenodd"
              d="m12 11.664-2.793 2.793-1.414-1.414 3.5-3.5a1 1 0 0 1 1.414 0l3.5 3.5-1.414 1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              fill="#0C0C0C"
              fillRule="evenodd"
              d="M12 12.336 9.207 9.543l-1.414 1.414 3.5 3.5a1 1 0 0 0 1.414 0l3.5-3.5-1.414-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        )}
      </button>

      {isOpen && children && (
        <div className={styles.sectionContent}>{children}</div>
      )}
    </div>
  );
}
export default FilterSection;
