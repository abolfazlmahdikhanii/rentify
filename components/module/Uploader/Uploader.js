import React, { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import styles from "./Uploader.module.css";

const Uploader = ({ onFileSelect, onRemove, existingImage }) => {
  const id = useId();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Initialize with existing image if provided
  useEffect(() => {
    if (existingImage) {
      // Handle both URL strings and file objects
      const url = typeof existingImage === 'string' 
        ? existingImage 
        : existingImage.url || (existingImage instanceof File ? URL.createObjectURL(existingImage) : null);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }, [existingImage]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file");
      return false;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError(`File size exceeds ${2}MB limit.`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (validateFile(file)) {
      // Clean up previous preview URL if it was a blob
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    
    // Clean up blob URL if it exists
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setPreviewUrl(null);
    setError(null);
    
    if (onRemove) {
      onRemove();
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dragging : ""} ${
          previewUrl ? styles.hasPreview : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {previewUrl ? (
          <div className={styles.previewContainer}>
            <img
              src={previewUrl}
              alt="Preview"
              className={styles.preview}
              onError={(e) => {
                e.target.src = '/placeholder.svg'; // Fallback if image fails to load
              }}
            />
            <div className={styles.changeOverlay}>
              <span>برای تغییر کلیک کنید</span>
            </div>
           
          </div>
        ) : (
         <div className={styles.iconContainer}>
            <div className={styles.imageIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="44"
                height="44"
                fill="none"
                viewBox="0 0 44 44"
              >
                <path
                  fill="#7E8288"
                  fillRule="evenodd"
                  d="M33.918 17.417h-11V13.75h11z"
                  clipRule="evenodd"
                ></path>
                <path
                  fill="#7E8288"
                  fillRule="evenodd"
                  d="M30.25 10.083v11h-3.666v-11z"
                  clipRule="evenodd"
                ></path>
                <path
                  fill="#7E8288"
                  fillRule="evenodd"
                  d="M7.334 5.5c-1.013 0-1.833.82-1.833 1.833v29.333c0 1.013.82 1.834 1.833 1.834h29.333c1.013 0 1.834-.821 1.834-1.834v-8.25h3.666v8.25a5.5 5.5 0 0 1-5.5 5.5H7.334a5.5 5.5 0 0 1-5.5-5.5V7.333a5.5 5.5 0 0 1 5.5-5.5h8.25V5.5z"
                  clipRule="evenodd"
                ></path>
                <path
                  fill="#7E8288"
                  fillRule="evenodd"
                  d="M14.1 30.133a1.833 1.833 0 0 0-2.779-.077l-6.297 6.927-2.713-2.466 6.297-6.928a5.5 5.5 0 0 1 8.338.232l9.227 11.356-2.845 2.312z"
                  clipRule="evenodd"
                ></path>
                <path
                  fill="#7E8288"
                  fillRule="evenodd"
                  d="M31.38 34.888a1.833 1.833 0 0 0-2.503-.083l-4.751 4.158-2.415-2.76 4.752-4.158a5.5 5.5 0 0 1 7.51.25l5.825 5.825-2.593 2.593zM28.418 5.5c-5.569 0-10.083 4.514-10.083 10.083s4.514 10.083 10.083 10.083 10.083-4.514 10.083-10.083S33.987 5.5 28.418 5.5m-13.75 10.083c0-7.594 6.156-13.75 13.75-13.75s13.75 6.156 13.75 13.75-6.156 13.75-13.75 13.75-13.75-6.156-13.75-13.75"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
        )}
        <input
          type="file"
          id={id}
          ref={fileInputRef}
          className={styles.fileInput}
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default Uploader;