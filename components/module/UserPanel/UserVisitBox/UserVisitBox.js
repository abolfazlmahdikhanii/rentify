"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Home, Bath, Car, Heart, Eye, Clock, Map, MoreVertical, X } from "lucide-react"
import styles from "./user-visit.module.css"

const calculateTimeRemaining = (visitDate, visitTime) => {
  const now = new Date()

  // For demo purposes, let's create a future date based on the property ID
  const visitDateTime = new Date()

  // Create different future times for different properties
  if (visitDate.includes("۲۶")) {
    visitDateTime.setDate(visitDateTime.getDate() + 2) // 2 days from now
    visitDateTime.setHours(14, 0, 0, 0) // 2 PM
  } else if (visitDate.includes("۲۸")) {
    visitDateTime.setDate(visitDateTime.getDate() + 4) // 4 days from now
    visitDateTime.setHours(10, 30, 0, 0) // 10:30 AM
  } else {
    visitDateTime.setHours(visitDateTime.getHours() + 3) // 3 hours from now
  }

  const timeDiff = visitDateTime.getTime() - now.getTime()

  if (timeDiff <= 0) return null

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days} روز و ${hours} ساعت`
  if (hours > 0) return `${hours} ساعت و ${minutes} دقیقه`
  return `${minutes} دقیقه`
}
 function UserVisitBox({
  property,
  onScheduleVisit,
  onViewDetails,
  onToggleFavorite,
  onViewMap,
  onCancelVisit,
  isFavorite = false,
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(null)
console.log(property);
  useEffect(() => {
    if (property.status === "scheduled" && property.visitDate && property.visitTime) {
      const updateTime = () => {
        const remaining = calculateTimeRemaining(property.visitDate, property.visitTime)
        setTimeRemaining(remaining)
      }

      updateTime()
      const interval = setInterval(updateTime, 60000) // Update every minute

      return () => clearInterval(interval)
    }
  }, [property.status, property.visitDate, property.visitTime])

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return styles.statusScheduled
      case "completed":
        return styles.statusCompleted
      case "cancelled":
        return styles.statusCancelled
      default:
        return styles.statusPending
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "scheduled":
        return "بازدید برنامه‌ریزی شده"
      case "completed":
        return "بازدید انجام شده"
      case "cancelled":
        return "بازدید لغو شده"
      default:
        return "برنامه‌ریزی بازدید"
    }
  }

  const handleMenuClick = (e) => {
    e.stopPropagation()
    setShowMenu(!showMenu)
  }

  const handleCancelClick = (e) => {
    e.stopPropagation()
    onCancelVisit?.(property.id)
    setShowMenu(false)
  }

  return (
    <div
      className={`${styles.card} ${isHovered ? styles.cardHovered : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.imageContainer}>
        <img src={property.image || "/placeholder.svg"} alt={property.title} className={styles.propertyImage} />
        <div className={styles.imageOverlay}>
          <button
            className={`${styles.favoriteBtn} ${isFavorite ? styles.favoriteActive : ""}`}
            onClick={() => onToggleFavorite?.(property.id)}
            aria-label="Toggle favorite"
          >
            <Heart className={styles.heartIcon} />
          </button>
          <div className={`${styles.statusBadge} ${getStatusColor(property.status)}`}>
            <Clock className={styles.statusIcon} />
            {getStatusText(property.status)}
          </div>
        </div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <div className={styles.header}>
            <h3 className={styles.title}>{property.title}</h3>
            <p className={styles.price}>{property.price}</p>
          </div>

          {(property.status === "scheduled" || property.status === "pending") && (
            <div className={styles.menuContainer}>
              <button className={styles.menuBtn} onClick={handleMenuClick} aria-label="گزینه‌های بیشتر">
                <MoreVertical className={styles.menuIcon} />
              </button>

              {showMenu && (
                <div className={styles.dropdownMenu}>
                  <button className={styles.menuItem} onClick={handleCancelClick}>
                    <X className={styles.menuItemIcon} />
                    لغو بازدید
                  </button>
                  <div className={styles.menuDivider}></div>
                  <div className={styles.menuNote}>این عمل قابل بازگشت نیست</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.location}>
          <MapPin className={styles.locationIcon} />
          <span>{property.location}</span>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <Home className={styles.featureIcon} />
            <span>{property.bedrooms} خواب</span>
          </div>
          <div className={styles.feature}>
            <Bath className={styles.featureIcon} />
            <span>{property.bathrooms} حمام</span>
          </div>
          <div className={styles.feature}>
            <Car className={styles.featureIcon} />
            <span>{property.parking} پارکینگ</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.area}>{property.area}</span>
          </div>
        </div>

        {property.visitDate && property.visitTime && (
          <div className={styles.visitInfo}>
            <Calendar className={styles.calendarIcon} />
            <div className={styles.visitDetails}>
              <span className={styles.visitDateTime}>
                بازدید: {property.visitDate} ساعت {property.visitTime}
              </span>
              {timeRemaining && property.status === "scheduled" && (
                <span className={styles.timeRemaining}>
                  <Clock className={styles.timeIcon} />
                  زمان باقی‌مانده: {timeRemaining}
                </span>
              )}
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button
            className={styles.primaryBtn}
            onClick={() => onScheduleVisit?.(property.id)}
            disabled={property.status === "completed" || property.status === "cancelled"}
          >
            {property.status === "scheduled"
              ? "تغییر زمان بازدید"
              : property.status === "completed"
                ? "بازدید انجام شده"
                : property.status === "cancelled"
                  ? "بازدید لغو شده"
                  : "برنامه‌ریزی بازدید"}
          </button>

          <button className={styles.secondaryBtn} onClick={() => onViewDetails?.(property.id)}>
            <Eye className={styles.eyeIcon} />
            جزئیات
          </button>

          <button className={styles.mapBtn} onClick={() => onViewMap?.(property.id)}>
            <Map className={styles.mapIcon} />
            نقشه
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserVisitBox