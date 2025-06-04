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
export const getDate = (date) => {
  const d = new Date(date);

  return new Intl.DateTimeFormat("fa", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
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
export const toastOption = {
  className: "custom-toast",
  delay: 300,
  closeButton: false,
  progress: 0,
  position: "top-center",
  hideProgressBar: true,
};
