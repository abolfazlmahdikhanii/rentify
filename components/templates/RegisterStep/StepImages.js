import React from "react";
import Uploader from "@/components/module/Uploader/Uploader";
import styles from "../../../styles/RegisterStep.module.css";

const StepImages = ({ addImage, errors,images=[] }) => {
  return (
    <>
      <div className={styles.uploaderGrid}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Uploader key={index} onFileSelect={addImage} existingImage={images[index]?.imageUrl || null} />
        ))}
      </div>
      {errors.images && (
        <p role="alert" className={styles.error}>
          {errors.images.message}
        </p>
      )}
    </>
  );
};

export default StepImages;
