import Image from "next/image";
import styles from "./loader.module.css";

const Loader = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <Image
          src="/images/logo.png"
          alt="Rentify Logo"
          width={120}
          height={48}
        />

        <div className={styles.spinner}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default Loader;

