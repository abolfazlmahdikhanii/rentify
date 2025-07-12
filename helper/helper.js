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
  const newType = type.toString().toLowerCase();
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

export const toEnglish = (str) =>
  str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
// Main function - Calculates time remaining from backend date
 const calculateTimeRemainingCore = (visitDate, visitTime) => {
  const now = new Date()
  
  try {
    if (!visitDate) {
      throw new Error('Visit date is required')
    }
    
    const dateObj = new Date(visitDate)
    let visitDateTime
    
    if (visitTime) {
      // Use the provided time
      const cleanTime = toEnglish(visitTime)
      const timeParts = cleanTime.split(':')
      const hours = parseInt(timeParts[0])
      const minutes = parseInt(timeParts[1])
      const seconds = timeParts[2] ? parseInt(timeParts[2]) : 0
      
      visitDateTime = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), hours, minutes, seconds)
    } else {
      visitDateTime = new Date(visitDate)
    }
    
    if (isNaN(visitDateTime.getTime())) {
      throw new Error('Invalid date/time')
    }
    
    const timeDiff = visitDateTime.getTime() - now.getTime()
    
    if (timeDiff <= 0) return null
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
    
    return { days, hours, minutes, seconds, timeDiff }
  } catch (error) {
    console.error('Error calculating time remaining:', error)
    return null
  }
}
export const calculateTimeRemaining = (visitDate, visitTime) => {
 const result = calculateTimeRemainingCore(visitDate, visitTime)
  
  if (!result) return 'زمان بازدید گذشته است'
  
  const { days, hours, minutes, seconds } = result
  
  if (days > 7) return `${days} روز باقی مانده`
  if (days > 0) return `${days} روز، ${hours} ساعت و ${minutes} دقیقه`
  if (hours > 0) return `${hours} ساعت و ${minutes} دقیقه`
  if (minutes > 5) return `${minutes} دقیقه`
  if (minutes > 0) return `${minutes} دقیقه و ${seconds} ثانیه`
  return `${seconds} ثانیه`
}


