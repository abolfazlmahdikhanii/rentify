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
