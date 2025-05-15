import styles from "./StepProcess.module.css";
// import { Search, Calendar, Home, FileCheck } from "lucide-react"

export default function StepProcess() {
  return (
    <div>
      <h2 className={styles.title}><span className="titlePrimary">رنتی‌فای </span> چه طور کار می‌کند؟</h2>

      <div className={styles.stepsContainer}>
        {/* Step 1 - Search */}
        <div className={styles.step}>
          <div className={styles.iconContainer}>
            <span className={styles.number}>۱</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              fill="none"
              viewBox="0 0 50 50"
            >
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M4.166 20.833c0-9.205 7.462-16.667 16.667-16.667 9.204 0 16.666 7.462 16.666 16.667 0 9.204-7.462 16.666-16.666 16.666S4.166 30.037 4.166 20.833m16.667-7.292a7.29 7.29 0 0 1 7.291 7.292h4.167c0-6.329-5.13-11.459-11.458-11.459z"
                clipRule="evenodd"
              ></path>
              <path
                fill="#fff"
                fillRule="evenodd"
                d="m32.722 29.775 12.5 12.5-2.947 2.947-12.5-12.5z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <h3 className={styles.stepTitle}>جستجو</h3>
          <p className={styles.stepDescription}>
          ملک مورد علاقه‌‌ی خود را پیدا کنید          </p>
        </div>

        {/* Connector */}
        <div className={styles.connector}></div>

        {/* Step 2 - Schedule */}
        <div className={styles.step}>
          <div className={styles.iconContainer}>
            <span className={styles.number}>۲</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="51"
              height="50"
              fill="none"
              viewBox="0 0 51 50"
            >
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M2.086 12.5a6.254 6.254 0 0 1 6.258-6.25H41.72a6.254 6.254 0 0 1 6.258 6.25v4.167c0 1.15-.934 2.083-2.086 2.083H4.172a2.085 2.085 0 0 1-2.086-2.083zm6.258-2.083A2.085 2.085 0 0 0 6.258 12.5v2.083h37.548V12.5c0-1.15-.934-2.083-2.086-2.083z"
                clipRule="evenodd"
              ></path>
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M22.947 10.416v-6.25h4.172v6.25zM33.377 10.416v-6.25h4.172v6.25zM12.516 10.416v-6.25h4.172v6.25zM4.172 14.582a2.085 2.085 0 0 0-2.086 2.083v25a6.254 6.254 0 0 0 6.258 6.25H41.72a6.254 6.254 0 0 0 6.258-6.25v-25c0-1.15-.934-2.083-2.086-2.083zm18.163 9.807-6.258 6.25a2.09 2.09 0 0 1-2.95 0l-4.172-4.167 2.95-2.946 2.697 2.693 4.783-4.777zm12.516 6.25 6.258-6.25-2.95-2.947-4.783 4.777-2.697-2.693-2.95 2.946 4.172 4.166a2.09 2.09 0 0 0 2.95 0m6.258 4.166-6.258 6.25a2.09 2.09 0 0 1-2.95 0L27.73 36.89l2.95-2.947 2.697 2.694 4.783-4.777zM10.43 39.582h10.43v-4.167H10.43z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <h3 className={styles.stepTitle}>برنامه بازدید</h3>
          <p className={styles.stepDescription}>
          زمان خود را برای بازدید از ملکتان مشخص کنید
          </p>
        </div>

        {/* Connector */}
        <div className={styles.connector}></div>

        {/* Step 3 - Visit */}
        <div className={styles.step}>
          <div className={styles.iconContainer}>
            <span className={styles.number}>۳</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="51"
              height="50"
              fill="none"
              viewBox="0 0 51 50"
            >
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M8.344 6.25a2.085 2.085 0 0 0-2.086 2.084v33.333c0 1.15.934 2.084 2.086 2.084h8.344v4.166H8.344a6.254 6.254 0 0 1-6.258-6.25V8.334a6.254 6.254 0 0 1 6.258-6.25h9.85c1.566 0 3.075.586 4.229 1.643l9.967 9.124a6.25 6.25 0 0 1 2.03 4.608v3.375h-4.173v-3.375c0-.584-.245-1.142-.676-1.536l-9.967-9.125a2.1 2.1 0 0 0-1.41-.547z"
                clipRule="evenodd"
              ></path>
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M17.73 11.46V4.168h4.172v7.292c0 1.15.934 2.083 2.086 2.083h7.302v4.167h-7.302a6.254 6.254 0 0 1-6.257-6.25M17.01 35.418c.686 1.095 2.001 2.941 3.925 4.62 2.313 2.018 5.406 3.713 9.312 3.713s6.999-1.695 9.31-3.712c1.925-1.68 3.24-3.526 3.927-4.621-.687-1.095-2.002-2.941-3.926-4.62-2.312-2.018-5.405-3.713-9.311-3.713s-7 1.695-9.312 3.712c-1.924 1.68-3.238 3.526-3.926 4.621m1.18-7.758c2.82-2.46 6.85-4.742 12.057-4.742s9.236 2.281 12.056 4.742a25.4 25.4 0 0 1 5.15 6.267c.53.926.53 2.056 0 2.982a25.4 25.4 0 0 1-5.15 6.267c-2.82 2.46-6.85 4.742-12.056 4.742-5.208 0-9.237-2.281-12.057-4.742a25.4 25.4 0 0 1-5.15-6.267 2.99 2.99 0 0 1 0-2.982 25.4 25.4 0 0 1 5.15-6.267"
                clipRule="evenodd"
              ></path>
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M30.246 33.335a2.085 2.085 0 0 0-2.086 2.083c0 1.15.934 2.083 2.086 2.083a2.085 2.085 0 0 0 2.086-2.083c0-1.15-.934-2.083-2.086-2.083m-6.258 2.083a6.254 6.254 0 0 1 6.258-6.25 6.254 6.254 0 0 1 6.258 6.25 6.254 6.254 0 0 1-6.258 6.25 6.254 6.254 0 0 1-6.258-6.25"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <h3 className={styles.stepTitle}>بازدید از ملک</h3>
          <p className={styles.stepDescription}>
          ملک خود را در زمان مشخص کرده بازدید کنید
          </p>
        </div>

        {/* Connector */}
        <div className={styles.connector}></div>

        {/* Step 4 - Finalize */}
        <div className={styles.step}>
          <div className={styles.iconContainer}>
            <span className={styles.number}>۴</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="51"
              height="50"
              fill="none"
              viewBox="0 0 51 50"
            >
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M4.172 21.356a2.085 2.085 0 0 0-2.086 2.083v16.667c0 1.15.934 2.083 2.086 2.083h6.258a2.085 2.085 0 0 0 2.086-2.084V23.44c0-1.15-.934-2.084-2.086-2.084z"
                clipRule="evenodd"
              ></path>
              <path
                fill="#fff"
                fillRule="evenodd"
                d="m20.026 30.106 7.231 5.416c.361.27.8.417 1.252.417h14.254a5.21 5.21 0 0 1 5.215 5.208 5.21 5.21 0 0 1-5.215 5.209H25.368c-.591 0-1.18-.084-1.748-.25l-13.772-4 1.165-4.001 13.772 4q.286.084.583.084h17.395a1.042 1.042 0 1 0 0-2.084H28.51a6.26 6.26 0 0 1-3.755-1.25l-7.231-5.416z"
                clipRule="evenodd"
              ></path>
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M19.132 25.522H10.43v-4.166h8.702c1.66 0 3.251.658 4.425 1.83l7.085 7.076a5.76 5.76 0 0 1 1.69 4.077v1.34a4.43 4.43 0 0 1-4.432 4.426c-.96 0-1.892-.31-2.66-.885l-7.718-5.781 2.503-3.334 7.719 5.782a.26.26 0 0 0 .417-.209V34.34c0-.424-.169-.83-.47-1.13l-7.084-7.077a2.09 2.09 0 0 0-1.475-.61M22.945 6.25a4.17 4.17 0 0 1 4.172-4.166h16.688a4.17 4.17 0 0 1 4.172 4.167v10.416a4.17 4.17 0 0 1-4.172 4.167H27.117a4.17 4.17 0 0 1-4.172-4.167zm7.301 5.209a5.21 5.21 0 0 1 5.215-5.208 5.21 5.21 0 0 1 5.215 5.208 5.21 5.21 0 0 1-5.215 5.208 5.21 5.21 0 0 1-5.215-5.208"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <h3 className={styles.stepTitle}>نهایی کردن معامله</h3>
          <p className={styles.stepDescription}>
          به کمک مشاورین املاک ما معامله‌ی خود را نهایی کنید
          </p>
        </div>
      </div>
    </div>
  );
}
