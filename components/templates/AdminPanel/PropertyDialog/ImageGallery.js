import React, { useState, useEffect } from "react";
import styles from "./PropertyDialog.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageGallery = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Determine which image array to use
  const images = property?.images || property?.main_image || [];
  const hasMultipleImages = images.length > 1;

  // Reset current index when property changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [property]);

  // Ensure current index is within bounds
  useEffect(() => {
    if (currentImageIndex >= images.length) {
      setCurrentImageIndex(0);
    }
  }, [currentImageIndex, images.length]);

  // Navigation functions
  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "ArrowLeft") goToPrevious();
  };

  const currentImage = images[currentImageIndex];
  const imageUrl = currentImage?.url || "/images/empty-image.jpg";

  return (
    <div className={styles.imageGallery} onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Main Image Display */}
      <div className={styles.mainImage}>
        <img
          src={imageUrl}
          alt={`تصویر ملک ${currentImageIndex + 1}`}
          className={styles.propertyImage}
          loading="lazy"
        />

        {/* Image Counter */}
        {hasMultipleImages && (
          <div className={styles.imageCounter}>
            {currentImageIndex + 1} / {images.length}
          </div>
        )}

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <div className={styles.sliderBtn}>
            <button
              onClick={goToPrevious}
              className={`${styles.navButton} ${styles.prevButton}`}
              aria-label="تصویر قبلی"
            >
              <ChevronRight size={14} />
            </button>
            <button
              onClick={goToNext}
              className={`${styles.navButton} ${styles.nextButton}`}
              aria-label="تصویر بعدی"
            >
              <ChevronLeft size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultipleImages && (
        <div className={styles.thumbnails}>
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`${styles.thumbnail} ${
                currentImageIndex === index ? styles.thumbnailActive : ""
              }`}
              aria-label={`نمایش تصویر ${index + 1}`}
            >
              <img
                src={image.url || "/images/empty-image.jpg"}
                alt={`تصویر کوچک ${index + 1}`}
                className={styles.thumbnailImage}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
