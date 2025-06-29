import React, { useContext, useState } from "react";
import styles from "./PropertyDialog.module.css";
import Image from "next/image";
import {
  Bath,
  Bed,
  Calendar,
  Car,
  CheckCircle,
  Edit,
  Home,
  MapPin,
  Phone,
  Ruler,
  Star,
  Trash2,
  User,
  X,
  XCircle,
  Wifi,
  AirVent,
  Utensils,
  Tv,
  Waves,
  Trees,
  Shield,
} from "lucide-react";
import { getDate, getStatusText } from "@/helper/helper";
import { AuthContext } from "@/context/AuthContext";
import DeleteModal from "@/components/module/DeleteModal/DeleteModal";

const PropertyDialog = ({
  isOpen,
  onClose,
  property,
  approveHandler,
  rejectHandler,
  deleteHandler,
}) => {
  const { user } = useContext(AuthContext);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(null);
  const [reason, setReason] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ""}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>{property?.title}</h2>
            <span
              className={`status ${
                property?.status === "pending"
                  ? "status__pending"
                  : property?.status === "approved"
                  ? "status__approved"
                  : "status__rejected"
              }`}
            >
              {getStatusText(property?.status)}
            </span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X className={styles.iconSmall} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            {/* Image Gallery */}
            <div className={styles.imageGallery}>
              <div className={styles.mainImage}>
                <img
                  src={
                    property?.images[currentImageIndex]?.url ||
                    "/images/empty-image.jpg"
                  }
                  alt={`تصویر ملک ${currentImageIndex + 1}`}
                  className={styles.propertyImage}
                />
                {property?.images?.length > 1 ? (
                  <div className={styles.imageCounter}>
                    {currentImageIndex + 1} / {property?.images?.length}
                  </div>
                ) : null}
              </div>
              {property?.images.length > 1 ? (
                <div className={styles.thumbnails}>
                  {property?.images?.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`${styles.thumbnail} ${
                        currentImageIndex === index
                          ? styles.thumbnailActive
                          : ""
                      }`}
                    >
                      <img
                        src={image.url || "/images/empty-image.jpg"}
                        alt={`تصویر کوچک ${index + 1}`}
                        className={styles.thumbnailImage}
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Property Information */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>جزئیات ملک</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.propertyMeta}>
                  <MapPin className={styles.iconSmall} />
                  {property?.full_address || property?.location}
                </div>

                <div className={styles.specsGrid}>
                  <div className={styles.specItem}>
                    <Bed className={styles.iconSmall} />
                    <span>{property?.bedrooms} خوابه</span>
                  </div>
                  <div className={styles.specItem}>
                    <Bath className={styles.iconSmall} />
                    <span>{property?.bathrooms} حمام</span>
                  </div>
                  <div className={styles.specItem}>
                    <Ruler className={styles.iconSmall} />
                    <span>{property?.building_area} متر مربع</span>
                  </div>
                  <div className={styles.specItem}>
                    <Car className={styles.iconSmall} />
                    <span>{property?.parking ? 1 : 0} پارکینگ</span>
                  </div>
                </div>

                <div className={styles.separator} />

                <div className={styles.infoGrid}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>اجاره ماهانه:</span>
                    <span className={styles.priceValue}>
                      {property?.ejare_price.toLocaleString()} تومان
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h4 className={styles.cardTitle}>توضیحات</h4>
              </div>
              <div className={styles.cardContent}>
                <p className={styles.description}>{property?.description}</p>
              </div>
            </div>

            {/* Amenities */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h4 className={styles.cardTitle}>امکانات</h4>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.amenitiesGrid}>
                  {property.equipment.map((amenity) => {
                    return (
                      <div key={amenity.id} className={styles.amenityItem}>
                        <span
                          dangerouslySetInnerHTML={{ __html: amenity.icon }}
                        ></span>
                        <span>{amenity.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h4 className={styles.cardTitle}>اطلاعات مالک</h4>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.ownerProfile}>
                  <div className={styles.avatar}>
                    <div>
                      {property.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  </div>
                  <div className={styles.ownerDetails}>
                    <p className={styles.ownerName}>{property.author}</p>
                    <div className={styles.ownerContact}>
                      <Phone className={styles.iconSmall} />
                      {property.contact_phone}
                    </div>
                    <p className={styles.ownerEmail}>
                      {property?.author_email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h4 className={styles.cardTitle}>تاریخچه</h4>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>تاریخ ثبت:</span>
                    <span>{getDate(property.created_at)}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>آخرین بروزرسانی:</span>
                    <span>
                      {property.updated_at
                        ? getDate(property?.updated_at)
                        : "-"}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>شناسه ملک:</span>
                    <span className={styles.infoValue}>prop-{property.id}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h4 className={styles.cardTitle}>دلیل رد</h4>
              </div>
              <div className={styles.cardContent}>
                <div>
                  <textarea
                    className="text-area2"
                    placeholder="لطفا دلیل رد را بنویسید"
                    value={
                      property.status === "rejected"
                        ? property.rejection_reason
                        : reason
                    }
                    readOnly={property.status === "rejected"}
                    onChange={(e) =>
                      property.status !== "rejected" &&
                      setReason(e.target.value)
                    }
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={styles.footer}>
          <div className={styles.footerActions}>
            {property.status === "pending" && (
              <>
                <button
                  onClick={() => approveHandler(property?.id)}
                  disabled={isLoading !== null}
                  className={`${styles.btn} ${styles.btnApprove}`}
                >
                  {isLoading === "approve" ? (
                    "در حال تایید..."
                  ) : (
                    <>
                      <CheckCircle className={styles.iconSmall} />
                      تایید
                    </>
                  )}
                </button>
                <button
                  onClick={() => rejectHandler(property?.id, reason)}
                  disabled={isLoading !== null}
                  className={`${styles.btn} ${styles.btnReject}`}
                >
                  {isLoading === "reject" ? (
                    "در حال رد..."
                  ) : (
                    <>
                      <XCircle className={styles.iconSmall} />
                      رد
                    </>
                  )}
                </button>
              </>
            )}

            {/* Edit button - shown only to owner for non-pending properties */}
            {property.status !== "pending" &&
              property?.user_id === user?.id && (
                <button
                  onClick={() => editHandler(property)}
                  disabled={isLoading === "edit"}
                  className={`${styles.btn} ${styles.btnEdit}`}
                >
                  {isLoading === "edit" ? (
                    "در حال ویرایش..."
                  ) : (
                    <>
                      <Edit className={styles.iconSmall} />
                      ویرایش
                    </>
                  )}
                </button>
              )}

            {/* Delete button - shown to owner or admin for non-pending properties */}
            {property.status !== "pending" &&
              (property?.user_id === user?.id || user?.role === "admin") && (
                <button
                  onClick={() => deleteHandler(property)}
                  disabled={isLoading === "delete"}
                  className={`${styles.btn} ${styles.btnReject}`}
                >
                  {isLoading === "delete" ? (
                    "در حال حذف..."
                  ) : (
                    <>
                      <Trash2 className={styles.iconSmall} />
                      حذف
                    </>
                  )}
                </button>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDialog;
