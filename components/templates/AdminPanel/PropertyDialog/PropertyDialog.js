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
  Mail,
  ChevronLeft,
} from "lucide-react";
import { getDate, getStatusText } from "@/helper/helper";
import { AuthContext } from "@/context/AuthContext";
import DeleteModal from "@/components/module/DeleteModal/DeleteModal";
import ImageGallery from "./ImageGallery";

const PropertyDialog = ({
  isOpen,
  onClose,
  property,
  approveHandler,
  rejectHandler,
  deleteHandler,
  setEditingProperty,
}) => {
  const { user } = useContext(AuthContext);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(null);
  const [reason, setReason] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMore, setIsMore] = useState(false);

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
            {user.id.toString() === property?.owner._id.toString() && (
              <span
                className={`status ${
                  property?.status === "pending"
                    ? "status__pending"
                    : property?.status === "published"
                      ? "status__approved"
                      : "status__rejected"
                }`}
              >
                {getStatusText(property?.status)}
              </span>
            )}
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X className={styles.iconSmall} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            {/* Image Gallery */}
            <ImageGallery images={property.images} />

            {/* Property Information */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>جزئیات ملک</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.propertyMeta}>
                  <MapPin className={styles.iconSmall} />
                  {property?.location.address}
                </div>

                <div className={styles.specsGrid}>
                  <div className={styles.specItem}>
                    <Bed className={styles.iconSmall} />
                    <span>{` ${property.details?.bedrooms || 1} اتاق`}</span>
                  </div>
                  <div className={styles.specItem}>
                    <Bath className={styles.iconSmall} />
                    <span>
                      {property.details?.bathrooms ? `1 حمام` : "حمام ندارد"}
                    </span>
                  </div>
                  <div className={styles.specItem}>
                    <Ruler className={styles.iconSmall} />
                    <span>{` ${property.details?.buildingArea || 0} متر مربع`}</span>
                  </div>
                  <div className={styles.specItem}>
                    <Car className={styles.iconSmall} />
                    <span>
                      {property.details?.parking
                        ? `1 پارکینگ`
                        : "پارکینگ ندارد"}
                    </span>
                  </div>
                </div>

                <div className={styles.separator} />

                <div className={styles.infoGrid}>
                  {!!property?.rentPrice && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>اجاره ماهانه:</span>
                      <span className={styles.priceValue}>
                        {property?.rentPrice.toLocaleString()} تومان
                      </span>
                    </div>
                  )}
                  {!!property?.mortgagePrice && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>رهن ماهانه:</span>
                      <span className={styles.priceValue}>
                        {property?.mortgagePrice.toLocaleString()} تومان
                      </span>
                    </div>
                  )}
                  {!!property?.price && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>قیمت فروش:</span>
                      <span className={styles.priceValue}>
                        {property?.price.toLocaleString()} تومان
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h4 className={styles.cardTitle}>توضیحات</h4>
              </div>
              <div className={styles.cardContent}>
                <p
                  className={`${styles.description} ${
                    isMore ? styles.expend : styles.lowest
                  }`}
                >
                  {property?.details.description}
                </p>
                <p
                  className={styles.btnMore}
                  onClick={() => setIsMore((prev) => !prev)}
                >
                  {!isMore ? "مشاهده بیشتر" : "بستن"} <ChevronLeft size={15} />
                </p>
              </div>
            </div>

            {/* Amenities */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h4 className={styles.cardTitle}>امکانات</h4>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.amenitiesGrid}>
                  {property?.equipments?.map((amenity) => {
                    return (
                      <div key={amenity._id} className={styles.amenityItem}>
                        {/* <span
                          dangerouslySetInnerHTML={{ __html: amenity.icon }}
                        ></span> */}
                        <span>{amenity.equipmentId.title}</span>
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
                    <div>{property.owner.name.charAt(0) || "U"}</div>
                  </div>
                  <div className={styles.ownerDetails}>
                    <p className={styles.ownerName}>
                      {" "}
                      {property.owner.name || ""}{" "}
                      {property.owner.lastName || ""}
                    </p>
                    {property?.contact_phone && (
                      <div className={styles.ownerContact}>
                        <Phone className={styles.iconSmall} />
                        {property.contact_phone}
                      </div>
                    )}
                    {property?.author_email && (
                      <div className={styles.ownerContact}>
                        <Mail className={styles.iconSmall} />
                        {property.author_email}
                      </div>
                    )}
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
                    <span>{getDate(property.createdAt)}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>آخرین بروزرسانی:</span>
                    <span>
                      {property.updated_at ? getDate(property?.updatedAt) : "-"}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>شناسه ملک:</span>
                    <span className={styles.infoValue}>
                      prop-{property._id.slice(0, 6)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {user?.role === "admin" ||
            user.id.toString() === property?.owner._id.toString() ? (
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
                          ? property.rejectionReason
                          : reason
                      }
                      readOnly={
                        property.status === "rejected" &&
                        user.id.toString() === property?.owner._id.toString()
                      }
                      onChange={(e) =>
                        property.status !== "rejected" &&
                        user.role === "admin" &&
                        setReason(e.target.value)
                      }
                    ></textarea>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer Actions */}
        <div className={styles.footer}>
          <div className={styles.footerActions}>
            {property.status === "pending" && user.role === "admin" && (
              <>
                <button
                  onClick={() => approveHandler(property?._id)}
                  disabled={isLoading !== null}
                  className={`${styles.btn} ${styles.btnApprove}`}
                >
                  {isLoading === "published" ? (
                    "در حال تایید..."
                  ) : (
                    <>
                      <CheckCircle className={styles.iconSmall} />
                      تایید
                    </>
                  )}
                </button>
                <button
                  onClick={() => rejectHandler(property?._id, reason)}
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
            {property?.owner._id?.toString() === user?.id?.toString() && (
              <button
                onClick={() => setEditingProperty(property._id)}
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
            {(property?.owner._id.toString() === user?.id?.toString() ||
              user?.role === "admin") && (
              <button
                onClick={() => deleteHandler(property._id)}
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
