export const saveStorage = (key, value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};
export const getStorage = (key) => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
};

export const timeFormat = (time) => {
  const min = Math.floor(time / 60);
  const sec = time % 60;
  return `${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`;
};
export const getDate = (date, monthType) => {
  const d = new Date(date);

  return new Intl.DateTimeFormat("fa", {
    year: "numeric",
    month: monthType === "txt" ? "short" : "2-digit",
    day: "2-digit",
  }).format(d);
};
export const getDateRelative = (date) => {
  const d = new Date(date);
  const now = Date.now();
  const diff = d.getTime() - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const month = Math.floor(days / 30);
  const year = Math.floor(month / 12);

  const rtf = new Intl.RelativeTimeFormat("fa", {
    numeric: "auto",
  });

  // If more than 365 days (1 year), format by years
  if (Math.abs(days) > 365) {
    return rtf.format(year, "year");
  }
  // If more than 31 days, format by months
  else if (Math.abs(days) > 31) {
    return rtf.format(month, "month");
  }
  // Otherwise, format by days
  else {
    return rtf.format(days, "day");
  }
};
export const getStatusText = (status) => {
  switch (status) {
    case "pending":
      return "در انتظار بررسی";
    case "approved":
      return "تایید شده";
    case "rejected":
      return "رد شده";
    default:
      return status;
  }
};
export const getTypeText = (type) => {
  const newType=type.toString().toLowerCase()
  console.log(newType);
  switch (newType) {
    case "villa":
      return "ویلا";
    case "house":
      return "خانه";
    case "apartment":
      return "آپارتمان";
    default:
      return newType;
  }
};
export const toastOption = {
  className: "custom-toast",
  delay: 300,
  closeButton: false,
  progress: 0,
  position: "top-center",
  hideProgressBar: true,
};

export const calculateTimeRemaining = (visitDate, visitTime) => {
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
export const toEnglish = (str) => str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
